/// <reference types='Cypress'/>

import {HeaderPage} from '../e2e/pages/HeaderPage.page'
import {CreateAccountPage} from '../e2e/pages/CreateAccountPage.page'
import { CustomerLoginPage } from '../e2e/pages/CustomerLoginPage.page'
import { MyAccountPage } from '../e2e/pages/MyAccountPage.page'
import { AddNewAddressPage } from '../e2e/pages/AddNewAddressPage.page'
import {util} from "../e2e/pages/util.js"

var randomEmail = ""

describe('Create account and update users address using fixtures and POP', () => {

    before(function () {
        // Create random email
        randomEmail = 'test' + util.getRandomString('email', 5) + '@test.com'
    })

    beforeEach(() => {
        // Load fixture data and save it as userAccountData alias
        cy.fixture('accountData').then(function(data) {
            data.email = randomEmail
            this.data = data
        }).as('userAccountData') 

        // Go to magento site using environment variables
        cy.visit(Cypress.env('url'))

        // Assert user is on the main page
        cy.get('.blocks-promo').should('be.visible')
        cy.wait(1000)
    })

    afterEach(() => {
        // Sign out user
        cy.get(HeaderPage.buttons.actionButton).click()
        cy.get(HeaderPage.buttons.signOut).click()
        cy.get('.base').should('contain', 'You are signed out')     
    })

    it('Create account', () => {
        // Create new account by clicking on create an account button and filling in new account form
        cy.get(HeaderPage.buttons.createAccount).click()
        cy.get(CreateAccountPage.labels.pageTitle).should('have.text', 'Create New Customer Account')

        // Second example using .then()
        cy.get(CreateAccountPage.labels.pageTitle).then((title) => {
            const titleText = title.text()                                
            expect(titleText).is.eql('Create New Customer Account')
        })

        cy.get('@userAccountData').then((accountDataJson) => {
            const dataJson = accountDataJson

            CreateAccountPage.createNewAccount(dataJson.firstName, dataJson.lastName, dataJson.email, dataJson.pass)
            // Assert success acount creation message
            cy.get(MyAccountPage.messages.successMessage)
                .should('contain', 'Thank you for registering with Fake Online Clothing Store.')

            // Check if user is automatically signed in
            cy.get(HeaderPage.messages.greetingMessage)
                .should('contain.text', `Welcome, ${dataJson.firstName} ${dataJson.lastName}!`)     
        })
             
    })

    it('Update users address', () => {
        // Sign in as previously created user
        cy.contains('Sign In').click()
        cy.get(CustomerLoginPage.labels.pageTitle).should('contain.text', 'Customer Login')

        cy.get('@userAccountData').then((accountDataJson) => {
            const dataJson = accountDataJson

            CustomerLoginPage.signInUser(dataJson.email, dataJson.pass)

            // Assert user is signed in
            cy.get(HeaderPage.messages.greetingMessage)
                .should('contain.text', `Welcome, ${dataJson.firstName} ${dataJson.lastName}!`)   

            // Go to My Account page
            cy.get(HeaderPage.buttons.actionButton).click()
            cy.get(HeaderPage.buttons.myAccount).click()
            cy.get(MyAccountPage.labels.pageTitle).should('contain.text', 'My Account')

            // Go to Address Book page
            cy.get('a').contains('Address Book').click()

            // Assert already filled in data
            cy.get('#firstname').should('have.attr', 'value', dataJson.firstName)
            cy.get('#lastname').should('have.attr', 'value', dataJson.lastName)

            // Update address mandatory fields
            // First example:
            //AddNewAddressPage.updateAddress(dataJson.phoneNumber, dataJson.streetAddress, dataJson.city, dataJson.zipCode, dataJson.country)
            // Second example:
            AddNewAddressPage.updateAddressWithFixtureData(dataJson)

            // Assert address is saved
            cy.get(AddNewAddressPage.messages.successMessage).should('contain', 'You saved the address.')
        })
        
    })

    it('Sign in user by invoking custom command and switching between multiple config files', function() {

        cy.log('Username and pass environment variables are:')
        cy.log(Cypress.env("username"))
        cy.log(Cypress.env("password"))
        
        cy.signinUserCustomCommand(Cypress.env("username"), Cypress.env("password"))

        // Assert user is signed in
        cy.get(':nth-child(2) > .greet > .logged-in').should('contain.text', `Welcome`)        
        
    })
})