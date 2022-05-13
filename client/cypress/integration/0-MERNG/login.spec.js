describe('payment', () => {
    it('user can connect to his account', () => {
        //cy.visit('http://localhost:3000/');
        cy.visit('/');
        /* cy.findByRole('link', {
            name: /login/i
        }).click();
        cy.findByPlaceholderText(/username\.\./i).type('test01');
        cy.findByPlaceholderText(/password\.\./i).type('123456');
        cy.findByRole('button', {
            name: /login/i
        }).click(); */
        cy.loginWithRequest('test01', '123456');
        /* cy.findByRole('link', {
            name: /test01/i
        }).click(); */
        cy.contains('Test 01').click();
    })
})