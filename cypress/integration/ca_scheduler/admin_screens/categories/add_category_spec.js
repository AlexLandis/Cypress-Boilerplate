describe('Add a new category', () => {
    let componentId
    let componentName
    let entityList
    let agId
    let agName
    //let categoryId
    context('through the UI', () => {
        beforeEach(() => {
            cy.server()
            cy.route(
                'GET',
                'api/club/details'
            ).as('getClubDetails')
            cy.route(
                'GET',
                '/api/component/components'
            ).as('getComponentList')
            cy.visit('/club-settings/components')
            cy.get('h1').contains('Service Components').should('be.visible')
            cy.wait('@getComponentList').then((xhr) => {
                if(xhr.status === 200) {
                    componentId = xhr.responseBody.data[0].id
                    componentName = xhr.responseBody.data[0].name
                    cy.log(componentId)
                    cy.log(componentName)
                }
            })
        })

        it('verifies a valid component exists', () => {
            cy.get('.ca-ui-tile-grid').as('tileGrid').should('be.visible')
            cy.get('@tileGrid').children().as('componentTile').should('be.visible')
            cy.get('@componentTile').contains(componentName).should('be.visible')
        })

        context('Club Entities', () => {
            beforeEach(() => { 
            cy.server()
            cy.route(
                'GET',
                'api/component/components/' + componentId
            ).as('clubEntityList')
            cy.visit('/club-settings/components/' + componentId)
            cy.wait('@clubEntityList')
            cy.get('@clubEntityList').its('responseBody.data.entities').as('entities')
        })
        
            describe('fetched Entities', () => {
                Cypress._.range(0, 1).forEach((k) => {
                    it(`# ${k}`, function() {
                        const entity = this.entities[k];
                        cy.log(`entity ${entity.id} ${entity.name}`);
                        cy.wrap(entity).should('have.property', 'name');
                        cy.get('.cru-card-read').contains(entity.name).should('be.visible')
                    })
                    let categoryId
                })
            })

        })

        it('navigates to component and selects add category button', () => {
            cy.visit('/club-settings/components/' + componentId )
            cy.get('.nav-tree-item-label').contains('Add Category').should('be.visible').click()
            cy.wait('@getClubDetails')
            cy.url().should('contain', 'club-settings/categories/new?')
        })
        
        it('inputs required field information for category creation', () => {
            cy.server()
            cy.route(
                'GET',
                'api/component/components/' + componentId
            ).as('getComponent')
            cy.route(
                'GET',
                '/api/accounting/accounting-groups?entityId=17&limit=50&offset=0'
            ).as('accountingGrps')
            cy.route(
                'POST',
                '/api/component/categories'
            ).as('postNewCategory')
            cy.visit('/club-settings/categories/new?componentId=' + componentId)
            cy.wait('@getComponent')
            cy.get('input[placeholder="Enter Category Name"]').should('be.visible').focus().type('Cat.' + Date.now())
            cy.get('.select-V2-container').should('be.visible')



            cy.get('.ca-ui-async-select').contains('Automation_Entity').as('autoEntity')
            cy.get('@autoEntity').parent().find('.select-V2-container').click()
            cy.wait('@accountingGrps').then((xhr) => {
                if(xhr.status === 200) {
                    agId = xhr.responseBody.data[0].id
                    agName = xhr.responseBody.data[0].name
                    cy.get('.options-list').should('contain', agName).find('li').contains(agName).click()
                }
            })

            cy.get('.category-form-submit').contains('Submit').should('be.visible').click()
            cy.wait('@postNewCategory').then((xhr) => {
                if(xhr.status == 200) {
                    categoryId = xhr.responseBody.data[0].id
                    cy.url().should('contain', categoryId)
                }
            })

        })

    })
})