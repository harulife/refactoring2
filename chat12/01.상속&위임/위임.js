class Booking{
  constructor(show, date) {
    this._show = show;
    this._date = date;
  }

  get hasTalkback() {
    return this._premiumDelegate
      ? this._premiumDelegate.hasTalkBack
      : this._show.hasOwnProperty('talkback') && !this.isPeakDay;
  }

  get basePrice(){
    let result = this._show.price;
    if(this.isPeakDay) result += Math.round(result * 0.15);
    return this._premiumDelegate
      ? this._premiumDelegate.extendBasePrice(result)
      : result;
  }

  get hasDinner(){
    return this._premiumDelegate
      ? this._premiumDelegate.hasDinner
      : undefined
  }

  _bePremium(extras){
    this._premiumDelegate = new PremiumBookingDelegate(this, extras)
  }
}

class PremiumBookingDelegate{
  constructor(hostBooking, extras) {
    this._host = hostBooking;
    this._extras = extras;
  }

  get hasTalkBack(){
    return this._host._show.hasOwnProperty('talkback')
  }

  extendBasePrice(base){
    return Math.round(base + this._extras.premiumFee);
  }

  get hasDinner(){
    return this._extras.hasOwnProperty('dinner') && !this._host.isPeakDay;
  }

}


function cretePremiumBooking(show, date, extras){
  const result = new Booking(show, date)
  result._bePremium(extras)
  return result
}

