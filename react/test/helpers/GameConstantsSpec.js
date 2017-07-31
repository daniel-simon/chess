describe('GameConstants', () => {
  let gameConstants = require('../../src/helpers/GameConstants.js')

  describe('firstRowFor()', () => {
    it('should return 0 for white', () => {
      let row = gameConstants.firstRowFor('white')
      expect(row).toEqual(0);
    });
    it('should return 7 for black', () => {
      let row = gameConstants.firstRowFor('black')
      expect(row).toEqual(7);
    });
  })


});
