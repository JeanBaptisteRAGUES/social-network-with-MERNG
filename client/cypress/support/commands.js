import "@testing-library/cypress/add-commands"

Cypress.Commands.add('login', (username, password) => {
    cy.visit('/login');
    cy.findByPlaceholderText(/pseudo\.\./i).type(username);
    cy.findByPlaceholderText(/mot de passe\.\./i).type(password);
    cy.findByRole('button', {
        name: /connexion/i
    }).click();
});

Cypress.Commands.add('loginFromHome', (username, password) => {
    cy.findByRole('link', {
        name: /connexion/i
    }).click();
    cy.findByPlaceholderText(/pseudo\.\./i).type(username);
    cy.findByPlaceholderText(/mot de passe\.\./i).type(password);
    cy.findByRole('button', {
        name: /connexion/i
    }).click();
});

const LOGIN_USER = `
  mutation {
    login(username: "test01", password: "123456"){
      id email username createdAt token
    }
  }
`
//TODO: rendre la requete dynamique en prenant en compte username et password
Cypress.Commands.add('loginWithRequest', (username, password) => {
    cy.request({
        method: 'POST',
        url: "http://localhost:5000/graphql",
        body: { query : LOGIN_USER },
    })
    .then(res => {
        window.localStorage.setItem('jwtToken', res.body.data.login.token);
        cy.visit('/');
    })
});

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
