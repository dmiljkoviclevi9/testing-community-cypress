/// <reference types="cypress" />

describe('First Cypress test', () => {
    it('Visit IMDB', ()=>{
        cy.visit('https://www.imdb.com/')
        cy.get('.nav__userMenu > .ipc-button--single-padding > .ipc-button__text').click()
        cy.get(':nth-child(4) > .list-group-item').click()
        cy.get('#ap_customer_name').type('Hello,my name is Cypress')
    })
})