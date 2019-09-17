describe('Filters the calendar page', () => {
    let entityName = 'Automation_Entity'
    let resourceName = 'Automation Resource'
    let componentId
    let componentName
    context('By resource UI', () => {
        beforeEach(() => {
            cy.server()
            cy.route(
                'GET',
                '/api/component/components'
            ).as('getComponentList')
            cy.visit('/scheduler')
            cy.wait('@getComponentList').then((xhr) => {
                if(xhr.status === 200) {
                    componentId = xhr.responseBody.data[0].id
                    componentName = xhr.responseBody.data[0].name
                    cy.log(componentId)
                    cy.log(componentName)
                }
            })
        })
        it('should load filtered calendar view', () => {
            cy.get('.calendar-basis-toggle').first().as('flexColumn')
            cy.get('@flexColumn').last().as('resourceForm')
            cy.get('@resourceForm').first().as('byResourceButton')
            cy.get('@byResourceButton').first().as('buttonText')
            cy.get('@buttonText').contains('By Resource').click()
            cy.wait(500)

            cy.get('.entity-select').first().as('entityFilter')
            cy.get('@entityFilter').first().as('entitySelectList')
            cy.get('@entitySelectList').last().as('entitySelectDiv')
            cy.get('@entitySelectDiv').first().as('entitySelectionWrapper')
            cy.get('@entitySelectionWrapper').first().as('entitySelection')
            cy.get('@entitySelection').click()
            cy.get('@entitySelection').contains(entityName).click()

            cy.wait(1000)

            cy.get('.resource-select').first().as('resourceFilter')
            cy.get('@resourceFilter').first().as('resourceSelectList')
            cy.get('@resourceSelectList').last().as('resourceSelectDiv')
            cy.get('@resourceSelectDiv').first().as('resourceSelectionWrapper')
            cy.get('@resourceSelectionWrapper').first().as('resourceSelection')
            cy.get('@resourceSelection').click()
            cy.get('@resourceSelection').contains(resourceName).click()


            cy.get('.filter-panel-body').should('be.visible')
            cy.get('.ca-calendar ').should('be.visible')
            cy.get('.component-name').should('be.visible')
            cy.get('.ca-ui-toggle-group ').children().as('range').should('be.visible').and('have.length', 4)
            cy.get('@range').first().should('contain', 'Today').and('not.have.css', 'background-color', 'rgb(19, 151, 225)')
            cy.get('@range').eq(1).should('contain', 'Week').and('have.css', 'background-color', 'rgb(19, 151, 225)')
        })
    })
})