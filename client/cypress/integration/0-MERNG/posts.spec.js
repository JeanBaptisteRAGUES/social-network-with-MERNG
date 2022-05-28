describe('Post can be created / liked / commented / deleted', () => {
    const USERNAME = 'test01';
    const PASSWORD = '123456';
    const POST_CONTENT = 'THIS is a test post *$97616$*';
    const COMMENT_CONTENT = 'THIS is a test comment *$97616$*';
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

    it('user can create a post, comment under the post, delete the comment and delete the post from the comment section', () => {
        cy.findByRole('textbox').type(POST_CONTENT);
        cy.findByRole('button', {
            name: /valider/i
        }).click();

        //Find the post by its content and ..
        
        //Get to the comments section
        cy.findByText(POST_CONTENT).parent().parent()
        .should('be.visible')
        .children().eq(1).children().eq(1).children().eq(0).click();

        //Write a new comment under the post
        cy.findByRole('textbox')
        .should('be.visible')
        .type(COMMENT_CONTENT);

        //Publish the comment
        cy.findByRole('button', {
            name: /publier/i
        }).click();

        //The comment has been created and can be deleted
        cy.findByText(COMMENT_CONTENT)
        .parent()
        .should('be.visible')
        .children().eq(0)
        .click();

        //Confirme delete comment
        cy.findByRole('button', {
            name: /ok/i
        })
        .should('be.visible')
        .click();

        //The comment no longer exists
        cy.findByText(COMMENT_CONTENT)
        .should('not.exist');

        //Find the delete btn and click it
        cy.findByText(POST_CONTENT).parent().parent()
        .should('be.visible')
        .children().eq(2).children().eq(2).click();

        //Confirme delete post
        cy.findByRole('button', {
            name: /ok/i
        })
        .should('be.visible')
        .click();

        //The post no longer exists
        cy.findByText(POST_CONTENT).should('not.exist');
    });
})