import { render } from 'preact';
import Footnote from 'Components/Footnote';

// Since the text content is taken from the bottom footnotes, it contains an arrow at the end that needs to be removed
// when the content is displayed within the embedded footnote.
const sanitizeContent = (content) => content.substring(0, content.length - 3).trimEnd();

window.onload = () => {
    //Grab all the hugo footnote references within the DOM. By default, Hugo assigns an
    // ID of `fnref:<index>` where the index corresponds to the sequential order of the footnote.
    const hugoFootnotes = Array.from(document.querySelectorAll("[id^='fnref']"));

    //No footnotes found, so exit the program
    if (hugoFootnotes.length === 0) return;

    hugoFootnotes.forEach((hugoFootnote, index) => {
        //Grab the text content of the footnote descriptions that are rendered at the bottom of the page
        const textContent = document.getElementById(`fn:${index + 1}`).textContent;

        render(
            <Footnote index={index + 1} id={hugoFootnote.id}>
                {sanitizeContent(textContent)}
            </Footnote>,
            hugoFootnote.parentElement,
            hugoFootnote
        );

        //Manually remove the hugo rendered footnote since Preact doesn't do it as part of the render() method
        hugoFootnote.remove();
    });
};
