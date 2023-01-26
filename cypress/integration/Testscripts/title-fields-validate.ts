/// <reference types="Cypress" />

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

    it('Validate the store name and current date/time displayed', function () {



        //Validate the page title
        cy.get("[data-testid=lepepe-company-title]").should("have.text", "La Coco Crypto Exchange")

        //Validate the page logo 
        cy.get("span > img[alt='Pepe masta']").should("be.visible")

        //validate the current date and time displayed
        //const now = new Date().getTime() // April 14, 2017 timestamp
        const date = new Date();
        console.log(date); 

    })

    it('Validate the currency exchange', function () {

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

    it.skip('Validate the values of buy and swap gets calculated based on input', function(){

       
        cy.get("button[data-testid='swap-dropdown']").click()

         //Select Bitcoin for swap
         cy.contains('Bitcoin').click()

         //Enter input value for bitcoin
         cy.get('input[data-testid=swap-input]').type(this.testdata.input1);

         //Click on buy dropdown button
        cy.get("button[data-testid='buy-dropdown']").click()

         //Select Bitcoin for swap
         cy.contains('Ethereum').click()

         //Validate the amount to receive
         cy.get('input[data-testid=buy-input]').then(($amount)=>{
            const amountreceived=$amount.text()

            cy.log(amountreceived)
         })

         //validate amount needed by enetering amount received
         

         
       

            

            cy.get('input[data-testid=buy-input]').invoke('val').should((buyvalue) => {

               // console.log(value);
            
               
              
                console.log(buyvalue);


                
                
            //get value from API
         cy.request({
            method : 'GET',
            url: 'https://api.coingecko.com/api/v3/exchange_rates'
         

         }).then((Response)=>{

           let body = JSON.parse(JSON.stringify(Response.body.rates.eth))
           console.log(body)
           var ethvalue=parseFloat(Response.body.rates.eth.value).toFixed(2)
            expect(ethvalue).to.eq(JSON.parse(JSON.stringify(buyvalue)))
         })

        
        })

         

         
         //Validate the amount needed
         cy.get('input[data-testid=swap-input]').then(($amount)=>{
            const amountneeded=$amount.text()

            cy.log(amountneeded)
         })


         


    })

    it('Validate the swap button functionality', function(){

        //validate the currency before swap
        cy.get("[data-testid=swap-label]").should("include.text","btc")

        //Click on the swap button
        cy.get("[data-testid=switch-token]").click()

        //validate the currency after swap
        cy.get("[data-testid=swap-label]").should("not.include.text","btc")
    })

    it("Validate the same currency cannot be selected on both fields", function(){

        //Click on swap dropdown button
        cy.get("button[data-testid='swap-dropdown']").click()

        //Select BTC from swap dropdown
        cy.contains(this.testdata.swapVal).click()

      //Click on buy dropdown button
        cy.get("button[data-testid='buy-dropdown']").click()

        //Validate bitcoin is not present in buy dropdown list
        cy.get('ul > li')
            .should('have.length', 6).each(($el, index, $list) => {
                expect($list).to.not.contain(this.testdata.swapVal)
            })

            //Close the buy dropdown button
    cy.get("button[data-testid='buy-dropdown']").click()
    })

    it.only("Validate the current exchange rate for 1 bitcoin", function(){

        //CER when no currency is entered in swap and buy fields
cy.get('input[data-testid=swap-input]').clear()

cy.get('input[data-testid=buy-input]').clear()

//validate the value displayed in cer field
cy.get("[data-testid=exchange-rate]").should("have.text", "N/A")

//Enter bitcoin to find its cer
cy.get('input[data-testid=swap-input]').type(this.testdata.input1);



    })
})