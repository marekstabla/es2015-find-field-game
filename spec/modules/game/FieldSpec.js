import Field from '../../../src/modules/game/Field';

describe("Field", () => {
    let field = null;

    beforeEach(() => {
        field = new Field(0,0);
    });

    it("should be able to mark field as discovered", () => {
        field.discover();
        expect(field.isDiscovered).toBeTruthy();
    });

    it("should mark field as winning field", () => {
        field.markAsWinningField();
        expect(field.isWinningField).toBeTruthy();
    });

    it("should discover not-winning field", () => {
        expect(field.discover()).toBeFalsy();
    });

    it("discover winning field", () => {
        field.markAsWinningField();
        expect(field.discover()).toBeTruthy();
    });
});
