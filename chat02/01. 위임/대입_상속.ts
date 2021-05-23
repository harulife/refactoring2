export default class StoreItemRepo {
    public static async count_byGroup(engine: string, params: object){
        try{
            const repo =  (engine === 'db') ? new StoreItemCountByGroupByDB(params) : new StoreItemCountByGroupByES(params);
            return await repo.exec()
        } catch (e) {

        }
    }
}

interface StoreItemCountByGroupParams {
    groupType : string,
    viewSoldOut : boolean,
    mainCategory : string | null,
    inputText : string | null,
    categoryList : [{
        mainCategory : string,
        subCategory : string | null,
    }] | null,
    nationList : Array<string> | null,
    isItemPriceWithShippingFee : boolean | null, // 상품 가격 배송비 포함하여 검색할것인가 2021-05-14 jun
    minPrice : number | null,
    maxPrice : number | null,
    shillaType : string | null,
}

class StoreItemCountByGroup {
    [index: string]: any; //index signature
    constructor(params: object) {
        this.setParameter(params)
    }

    setParameter(params: object){
        const parameters = params as StoreItemCountByGroupParams;
        Object.keys(parameters).forEach((key:string)=>{
            this[key] = parameters[key as keyof StoreItemCountByGroupParams]
        })
    }

    checkData(){
        if(!["category", "nation", "price"].includes(this.groupType)) throw new BadDataError("지원하지않는 groupType 입니다.");
        if(this.isItemPriceWithShippingFee) this.isItemPriceWithShippingFee = Boolean(this.isItemPriceWithShippingFee);
        if(this.minPrice) this.minPrice = Number(this.minPrice);
        if(this.maxPrice) this.maxPrice = Number(this.maxPrice);
        if(this.minPrice && this.maxPrice && this.minPrice > this.maxPrice) throw new BadDataError("최소 가격이 최대 가격보다 높습니다.");
    }
}

class StoreItemCountByGroupByDB extends StoreItemCountByGroup {
    constructor(params: object) {
        super(params)
    }

    makeQuery(){
        let tmp_today = new Date(); tmp_today.setUTCHours(0); tmp_today.setUTCMinutes(0); tmp_today.setUTCSeconds(0); tmp_today.setUTCMilliseconds(0);
        let searchQuery : any = { '$and' : [{isSelling : true}, {isDelete : {$ne : true}}, {'$or' : [{'dueDate' : {'$gte' : tmp_today }}, {'sellingInfo.isExistDueDate' : false}]}] };
        // showNationList : showNation,
        if(this.viewSoldOut == false) searchQuery['$and'].push({remainCount : {'$ne' : 0}}); // 솔드아웃 제외시
        if(this.mainCategory) searchQuery['$and'].push({ mainCategory: this.mainCategory }) // 메인 카테고리
        if(this.inputText) searchQuery['$and'].push({itemName : new RegExp(iCheck.findCheck(this.inputText), "i")}); // 검색어 있을시 2020-02-19 jun
        if(this.nationList && this.nationList.length > 0){ // 나라 리스트
            const nationArray = this.nationList.map((obj: any)=>{ if(obj) return {nation : obj}; });
            searchQuery['$and'].push({'$or' : nationArray});
        }
        if(this.categoryList && this.categoryList.length > 0){ // 카테고리 리스트
            const categoryArray : any = [];
            this.categoryList.map((obj: any)=>{
                let categoryJson : any = {};
                if(obj.mainCategory) categoryJson.mainCategory = obj.mainCategory;
                if(obj.subCategory) categoryJson.subCategory = obj.subCategory;
                categoryArray.push(categoryJson);
            });
            searchQuery['$and'].push({'$or' : categoryArray});
        }

        if(this.isItemPriceWithShippingFee == true){
            if(this.minPrice) searchQuery['$and'].push({itemPriceWithShippingFee : {$gte : this.minPrice}});
            if(this.maxPrice) searchQuery['$and'].push({itemPriceWithShippingFee : {$lte : this.maxPrice}});
        }
        else{
            if(this.minPrice) searchQuery['$and'].push({itemPrice : {$gte : this.minPrice}});
            if(this.maxPrice) searchQuery['$and'].push({itemPrice : {$lte : this.maxPrice}});
        }

        // 신라 면세점 제품 검색 관련 2020-12-18 jun / + 신라 상품 타입 추가 <mix, only, none> 2020-12-18 jun
        if(this.shillaType && this.shillaType == "only") searchQuery['$and'].push({isShilla : true});
        // 신라 상품 우리 상품 섞어
        else if(this.shillaType && this.shillaType == "mix"){}
        // 우리 상품만
        else searchQuery['$and'].push({isShilla : {$ne : true}});

        return searchQuery
    }

    makeGroupQuery(groupType: string){
        let groupQuery : any = {};
        if(groupType == "category") groupQuery = { mainCategory : "$mainCategory", subCategory : "$subCategory" };
        else if(groupType == "nation") groupQuery = { area : "$area", "nation" : "$nation" };
        else if(groupType == "price") groupQuery = { price : "$itemPrice" };
        return groupQuery
    }

    async search(searchQuery: object, groupQuery: object){
        return await StoreItemModel.aggregate([
            { "$match" : searchQuery },
            { "$group": { "_id" : groupQuery, "nums" : {"$sum" : 1}}},
        ]).exec();
    }

    async exec(){
        try{
            this.checkData();
            const searchQuery = this.makeQuery();
            const groupQuery = this.makeGroupQuery(this.groupType);
            const searchResult = await this.search(searchQuery, groupQuery);
            return searchResult ?? []
        } catch (e) {
            console.log(e)
        }

    }
}

class StoreItemCountByGroupByES extends StoreItemCountByGroup {
    constructor(params: object) {
        super(params)
    }
}


