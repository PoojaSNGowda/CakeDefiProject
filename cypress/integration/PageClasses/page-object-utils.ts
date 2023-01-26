class LaCocoPageObjects{

    getPageLogo(){
        return cy.get("span > img[alt='Pepe masta']");
    }

    getPageTitle(){
        return cy.get("[data-testid=lepepe-company-title]");
    }

    getSwapDropdown(){
        return cy.get("button[data-testid='swap-dropdown']");
    }

    getSwapInput(){
        return cy.get('input[data-testid=swap-input]')
    }

    getBuyDropdown(){
        return cy.get("button[data-testid='buy-dropdown']")
    }

    getBuyInput(){
        return cy.get('input[data-testid=buy-input]')
    }

    getSwapLabel(){
        return cy.get("[data-testid=swap-label]")
    }

    getSwapButton(){
        return cy.get("[data-testid=switch-token]")
    }

    getCurrentExchangeRate(){
        return cy.get("[data-testid=exchange-rate]")
    }
}

export const pageObjects=new LaCocoPageObjects()