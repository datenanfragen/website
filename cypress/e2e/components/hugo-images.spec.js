describe('Hugo-managed images', () => {
    beforeEach(() => {
        cy.visit('/blog/honey-data-collection');
    });

    it('Alt texts are output correctly', () => {
        for (const attr of ['alt', 'title']) {
            cy.get('picture img').should('have.attr', attr).and('contain', 'Photo of');
        }

        cy.visit('/blog');
        for (const attr of ['alt', 'title']) {
            cy.get('picture img').should('have.attr', attr);
        }
    });

    it('Images have correct width/height ratios specified', () => {
        cy.window().then((win) => {
            for (const selector of ['#logo', 'picture img']) {
                const img = win.document.querySelector(selector);

                const displayed_width = img.width;
                const displayed_height = img.height;
                const specified_width = img.getAttribute('width');
                const specified_height = img.getAttribute('height');

                const displayed_ratio = displayed_width / displayed_height;
                const specified_ratio = specified_width / specified_height;

                expect(displayed_ratio).to.be.approximately(specified_ratio, 0.1);
            }
        });
    });

    it('Images are sized appropriately', () => {
        cy.window().then((win) => {
            const img = win.document.querySelector('picture img');
            expect(img.width).to.be.approximately(img.naturalWidth, 10);
            expect(img.height).to.be.approximately(img.naturalHeight, 10);
        });
    });

    it('Images have .webp and .jpg variants, .webp is preferred if supported', () => {
        cy.window().then((win) => {
            const img = win.document.querySelector('picture img');
            expect(img.currentSrc).to.include('.webp');

            for (const { num, format } of [
                { num: 1, format: '.webp' },
                { num: 2, format: '.jpg' },
            ]) {
                const source = win.document.querySelector(`picture source:nth-of-type(${num})`);
                expect(source.srcset).to.include(format);
                expect(source.srcset).to.not.include(format === '.webp' ? '.jpg' : '.webp');
            }
        });
    });

    it('Featured images are not lazy-loaded', () => {
        cy.get('picture img').should('not.have.attr', 'loading');
    });

    it('Images below the fold are lazy-loaded', () => {
        cy.get('picture img').last().should('have.attr', 'loading').and('equal', 'lazy');
    });
});
