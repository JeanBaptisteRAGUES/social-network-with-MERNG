describe('Post can be created / liked / deleted', () => {
    const USERNAME = 'test01';
    const PASSWORD = '123456';
    const POST_CONTENT = 'THIS is a test post *$97616$*';
    //const USERNAME_REGEX = new RegExp(USERNAME, 'i');

    beforeEach(() => {
        cy.loginWithRequest(USERNAME, PASSWORD);
    });

    it('user can create a post, like it and delete it', () => {
        cy.findByRole('textbox').type(POST_CONTENT);
        cy.findByRole('button', {
            name: /valider/i
        }).click();

        //Find the post by its content and ..

        //Check there is no like
        cy.findByText(POST_CONTENT).parent().parent()
        .should('be.visible')
        .children().eq(1)
        .children().eq(0)
        .children().eq(1)
        .should('have.text', '0');
        
        //Like the post
        cy.findByText(POST_CONTENT).parent().parent()
        .should('be.visible')
        .children().eq(1).children().eq(0).children().eq(0).click();

        //Check if the like shows up
        cy.findByText(POST_CONTENT).parent().parent()
        .should('be.visible')
        .children().eq(1)
        .children().eq(0)
        .children().eq(1)
        .should('have.text', '1');

        //Find the delete btn and click it
        cy.findByText(POST_CONTENT).parent().parent()
        .should('be.visible')
        .children().eq(1).children().eq(2).click();

        cy.findByRole('button', {
            name: /ok/i
        })
        .should('be.visible')
        .click();

        cy.findByText(POST_CONTENT).should('not.exist');
    });
})