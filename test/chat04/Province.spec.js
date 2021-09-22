const Province = require('../../src/chat04/Province')
const sampleProvinceData = require('./sampleProvinceData')

describe('province', () => {
  let asia;

  beforeEach(() => {
    asia = new Province(sampleProvinceData());
  })

  it('shortfall', () => {
    expect(asia.shortfall).toEqual(5);
  })

  it('demandValue', () => {
    expect(asia.demandValue).toEqual(500);
  })

  it('demandCost', () => {
    expect(asia.demandCost).toEqual(270);
  })

  it('profit', () => {
    expect(asia.profit).toEqual(230);
  })
})
