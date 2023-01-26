/// <reference types="Cypress" />

import { pageObjects } from "../PageClasses/page-object-utils";
describe('My Second Test Suite', function () {

    before(function () {
        //visit site
        cy.visit("https://cake-la-pepe-exchange.vercel.app/")
    })

    beforeEach(function () {
        cy.fixture('testdata').then(function (testdata) {
            this.testdata = testdata
        })
    })

    it('Validate the store name and Logo', function () {


        //Validate the page logo 
        pageObjects.getPageLogo().should("be.visible")


        //Validate the page title
        pageObjects.getPageTitle().should("have.text", "La Coco Crypto Exchange")


    })

    it('Validate the  supported cryptocurrencies', function () {

        //Click on swap dropdown button
        cy.get("button[data-testid='swap-dropdown']").click()


        //Validate the swap dropdown crypto options listed
        cy.get('ul > li')
            .should('have.length', 6).each(($el, index, $list) => {
                expect($list).to.contain(this.testdata.cryptoSwap[index])
            })

        //Close the  swap dropdown  
        cy.get("button[data-testid='swap-dropdown']").click()

        //Click on buy dropdown button
        cy.get("button[data-testid='buy-dropdown']").click()

        //Validate the buy dropdown crypto options listed
        cy.get('ul > li')
            .should('have.length', 6).each(($el, index, $list) => {
                expect($list).to.contain(this.testdata.cryptoBuy[index])
            })

    })

    it('Validate the values of buy and swap gets calculated based on input', function () {


        pageObjects.getSwapDropdown().click()

        //Select Bitcoin for swap
        cy.contains('Bitcoin').click()

        //Enter input value for bitcoin
        pageObjects.getSwapInput().type(this.testdata.input1);

        //Click on buy dropdown button
        pageObjects.getBuyDropdown().click()

        //Select Bitcoin for swap
        cy.contains('Ethereum').click()

        //Validate the amount to receive
        pageObjects.getBuyInput().then(($amount) => {
            const amountreceived = $amount.text()

            cy.log(amountreceived)
        })


        pageObjects.getBuyInput().invoke('val').should((buyvalue) => {

            console.log(buyvalue);

            //get value from API
            cy.request({
                method: 'GET',
                url: 'https://api.coingecko.com/api/v3/exchange_rates'


            }).then((Response) => {

                let body = JSON.parse(JSON.stringify(Response.body.rates.eth))
                console.log(body)
                var ethvalue = parseFloat(Response.body.rates.eth.value).toFixed(2)
                expect(ethvalue).to.eq(JSON.parse(JSON.stringify(buyvalue)))
            })


        })

        //Validate the amount needed
        pageObjects.getSwapInput().then(($amount) => {
            const amountneeded = $amount.text()

            cy.log(amountneeded)
        })

    })

    it('Validate the swap button functionality', function () {

        //validate the currency before swap
        pageObjects.getSwapLabel().should("include.text", "btc")

        //Click on the swap button
        pageObjects.getSwapButton().click()

        //validate the currency after swap
        pageObjects.getSwapLabel().should("not.include.text", "btc")

        //Click on the swap button
        pageObjects.getSwapButton().click()

    })


    it("Validate the same currency cannot be selected on both fields", function () {

        //Click on swap dropdown button
        pageObjects.getSwapDropdown().click()

        //Select BTC from swap dropdown
        cy.contains(this.testdata.swapVal).click()

        //Click on buy dropdown button
        pageObjects.getBuyDropdown().click()

        //Validate bitcoin is not present in buy dropdown list
        cy.get('ul > li')
            .should('have.length', 6).each(($el, index, $list) => {
                expect($list).to.not.contain(this.testdata.swapVal)
            })

        //Close the buy dropdown button
        pageObjects.getBuyDropdown().click()
    })

    it("Validate both the inputs are able to switch to other currencies", function () {

        //Click on swap dropdown button
        pageObjects.getSwapDropdown().click()

        //Select Bitcoin for swap
        cy.contains('Bitcoin').click()

        //Click on swap dropdown button
        pageObjects.getSwapDropdown().click()

        cy.get('ul > li')
            .should('have.length', 6).each(($el, index, $list) => {

                cy.wrap($el).focus()

                cy.log($el.text());

                if ($el.text() === 'Tether') {
                    cy.wrap($el).click()
                }

            })

    })

    it("Validate the current exchange rate", function () {

        //CER when no currency is entered in swap and buy fields
        pageObjects.getSwapInput().clear()

        pageObjects.getBuyInput().clear()

        //validate the value displayed in cer field
        pageObjects.getCurrentExchangeRate().should("have.text", "N/A")


    })
})