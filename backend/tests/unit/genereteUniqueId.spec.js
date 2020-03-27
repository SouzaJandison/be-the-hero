const genereteUniqueId = require('../../src/utils/genereteUniqueId');

describe('Generete Unique ID', () => {
    it('should generate an unique ID', () => {
        const id = genereteUniqueId();
        expect(id).toHaveLength(8);
    });
});