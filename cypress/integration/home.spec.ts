describe("Homepage", () => {
    beforeEach(() => {
        cy.visit("/");
    });
    it("Brings header", () => {
        cy.getBySel("main-header").should("contain.text", "Joseph Simpson");
    });

});
