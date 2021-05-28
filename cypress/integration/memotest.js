/// <reference types="Cypress" />

const URL = 'http://127.0.0.1:5500/index.html';

context('Memotest', () => {

  before(() => {
    cy.visit(URL);
  });

  describe('juega al memotest', () => {
    const NUMERO_CUADROS = 16;
    it('se asegura de que el  tablero este bloqueadoantes del inicio del juego',()=>{
        cy.get('.blocker').should('not.have.css', 'display', 'none')
    });

    it('se asegura que haya un tablero con cuadros', () => {
      cy.get('#cards').find('.card').should('have.length', NUMERO_CUADROS);
    });

    it('se asegura de que el tablero se desbloquee',()=>{
        cy.get('#start').click();
        cy.get('.blocker').should('have.css', 'display', 'none');
        cy.get('#start').should('be.disabled');
        cy.get('#status').contains(
          `Let's go!`,
      );
    });
    
    it('se asegura que los cuadros sean aleatorios', () => {
      cy.get('.card').then((cuadros) => {
        let clasesOriginales = [];
        cuadros.each(function(i, cuadro) {
          clasesOriginales.push(cuadro.className);
        });

        cy.visit(URL);

        let clasesNuevas = [];
        cy.get('.card').then(nuevosCuadros => {
          nuevosCuadros.each(function(i, cuadro) {
            clasesNuevas.push(cuadro.className);
          });

        cy.wrap(clasesOriginales).should('not.deep.equal', clasesNuevas);
        });
      });
    });
    

    describe('resuelve el juego', () => {
      let mapaDePares, listaDePares;
      it('se asegura de que el tablero se desbloquee de nuevo',()=>{
        cy.get('#start').click();
        cy.get('.blocker').should('have.css', 'display', 'none')
        cy.get('#start').should('be.disabled');
    });
    

    it('elige una combinación errónea', () => {
      cy.get('.card').then(cuadros => {
        mapaDePares = obtenerParesDeCuadros(cuadros);
        listaDePares = Object.values(mapaDePares);

        console.log(listaDePares);
        cy.get(listaDePares[0][0]).click();
        cy.get(listaDePares[1][0]).click();
      });
    });

          it('resuelve el juego correctamente', () => {
        cy.get('.card').should('have.length', NUMERO_CUADROS);
       

        listaDePares.forEach((par) => {
          cy.get(par[0]).click();
          cy.get(par[1]).click();
        });

        
        const numeroTurnos = NUMERO_CUADROS / 2 +1 ; 
        cy.get('#status').contains(
                `You Win in ${numeroTurnos} moves.`,
            );
        cy.get('#start').should('not.be.disabled');
        cy.get('#start').contains('Play again.');
    });
  });

    

    describe('juega de nuevo',()=>{
      let mapaDePares, listaDePares;
      it('renicia el juego y bloque el iniciador',()=>{
        cy.get('#start').click();
        cy.get('#start').should('be.disabled');
        cy.get('#status').contains(
          `Here we go again.`,
      );
    });
    
    it('elige una combinación errónea', () => {
      cy.get('.card').then(cuadros => {
        mapaDePares = obtenerParesDeCuadros(cuadros);
        listaDePares = Object.values(mapaDePares);

        console.log(listaDePares);
        cy.get(listaDePares[0][0]).click();
        cy.get(listaDePares[1][0]).click();
      });
    });

    it('resuelve el juego correctamente', () => {
      cy.get('.card').should('have.length', NUMERO_CUADROS);

      listaDePares.forEach(par => {
        cy.get(par[0]).click();
        cy.get(par[1]).click();
      });

      
      const numeroTurnos = NUMERO_CUADROS / 2 + 1; 
      cy.get('#status').contains(
              `You Win in ${numeroTurnos} moves.`,
          );
      cy.get('#start').contains('Play again.');
    });


    });
  });
});


const obtenerParesDeCuadros = cuadros => {
  const pares = {};

  cuadros.each((i, cuadro) => {
    const claseColor = cuadro.className.replace('card color-hidden ', '');
    if (pares[claseColor]) {
      pares[claseColor].push(cuadro);
    } else {
      pares[claseColor] = [cuadro];
    }
  });
  console.log(pares);
  return pares;
}