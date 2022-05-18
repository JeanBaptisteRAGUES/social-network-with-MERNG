describe('post creation and deletion', () => {
    const USERNAME = 'test01';
    const PASSWORD = '123456';
    const POST_CONTENT = 'THIS is a test post *$97616$*';
    //const USERNAME_REGEX = new RegExp(USERNAME, 'i');

    beforeEach(() => {
        cy.loginWithRequest(USERNAME, PASSWORD);
    });

    it('user can create a post and delete it', () => {
        cy.findByRole('textbox').type(POST_CONTENT);
        cy.findByRole('button', {
            name: /valider/i
        }).click();

        //Find the post by its content
        const post = cy.findByText(POST_CONTENT).parent().parent();
        
        //Find the delete btn and click it
        post.children().eq(1).children().eq(2).click();
        
        cy.findByRole('button', {
            name: /ok/i
        }).click();
        cy.findByText(POST_CONTENT).should('not.exist');
    });
})