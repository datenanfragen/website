import { render } from 'preact';
import Footnote from 'Components/Footnote';

/* eslint-disable no-console */
//TESTING: - DO Not commit in final PR.
console.log(
    '%cThe footnotes.js file has been rendered  🟢',
    `background: powderblue; font-weight: bold; font-size: 20px;`
);

const getFootnoteProps = (footnotes) => {
    return footnotes.map((footnote, index) => {
        //Grab the text content of the footnote descriptions that are rendered at the bottom of the page
        //FIXME: Trim out the arrow at the end of the content string
        const textContent = document.getElementById(`fn:${index + 1}`).textContent;
        console.log('Individual: ', footnote);
        console.log('textContent: ', textContent);
        return {
            id: footnote.id,
            index: index + 1,
            content: textContent,
        };
    });
};

window.onload = () => {
    //Grab all the hugo footnote references within the doc. By default, Hugo assigns an
    // ID of `fnref:<index>` where the index corresponds to the sequential order of the footnote.
    const hugoFootnotes = Array.from(document.querySelectorAll("[id^='fnref']"));

    //No footnotes found so exit the program
    if (hugoFootnotes.length === 0) return;

    const footnotesData = getFootnoteProps(hugoFootnotes);

    //TESTING: - DO Not commit in final PR.
    console.groupCollapsed('Footnotes');
    console.log('Hugo footnotes: ', hugoFootnotes);
    console.dir(footnotesData);
    console.groupEnd();

    footnotesData.forEach((footnote) => {
        const hugoFootnote = document.getElementById(`${footnote.id}`);
        render(
            <Footnote index={footnote.index} id={footnote.id} content={footnote.content} />,
            hugoFootnote.parentElement,
            hugoFootnote
        );

        //Manually remove the hugo rendered footnote since Preact doesn't do it as part of the render() method
        hugoFootnote.remove();
    });
};
