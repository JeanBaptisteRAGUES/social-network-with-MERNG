describe('login/logout/errors', () => {
    const USERNAME = 'test01';
    const PASSWORD = '123456';
    const BAD_USERNAME = '***test%%%%9999***';
    const BAD_PASSWORD = '*1*2*3*4*5*6*';
    const EMPTY_USERNAME_ERROR_MSG = "Veuillez indiquer votre nom d'utilisateur";
    const EMPTY_PASSWORD_ERROR_MSG = "Veuillez rentrer votre mot de passe";
    const UNKNOW_USERNAME_ERROR_MSG = 'Utilisateur inconnu';
    const BAD_CREDENTIALS_ERROR_MSG = 'Identifiants invalides';
    //const USERNAME_REGEX = new RegExp(USERNAME, 'i');

    beforeEach(() => {
        cy.visit('/');
        cy.findByRole('link', {
            name: /login/i
        }).click();
    });

    it('user can connect to his account and logout', () => {
        cy.findByPlaceholderText(/username\.\./i).type(USERNAME);
        cy.findByPlaceholderText(/password\.\./i).type(PASSWORD);
        cy.findByRole('button', {
            name: /login/i
        }).click();
        cy.get('[data-cy=username-link]');
        cy.findByText(/logout/i).click();
        cy.get('[data-cy=home-link]');
    });

    it('shows an error message if user enters empty username', () => {
        cy.findByPlaceholderText(/password\.\./i).type(PASSWORD);
        cy.findByRole('button', {
            name: /login/i
        }).click();
        cy.contains(EMPTY_USERNAME_ERROR_MSG);
    });

    it('shows an error message if user enters empty password', () => {
        cy.findByPlaceholderText(/username\.\./i).type(USERNAME);
        cy.findByRole('button', {
            name: /login/i
        }).click();
        cy.contains(EMPTY_PASSWORD_ERROR_MSG);
    });

    it('shows an error message if user enters invalid username', () => {
        cy.findByPlaceholderText(/username\.\./i).type(BAD_USERNAME);
        cy.findByPlaceholderText(/password\.\./i).type(PASSWORD);
        cy.findByRole('button', {
            name: /login/i
        }).click();
        cy.contains(UNKNOW_USERNAME_ERROR_MSG);
    });

    it('shows an error message if user enters invalid password', () => {
        cy.findByPlaceholderText(/username\.\./i).type(USERNAME);
        cy.findByPlaceholderText(/password\.\./i).type(BAD_PASSWORD);
        cy.findByRole('button', {
            name: /login/i
        }).click();
        cy.contains(BAD_CREDENTIALS_ERROR_MSG);
    });
})