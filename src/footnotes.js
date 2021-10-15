import { render } from 'preact';
import Footnote from 'Components/Footnote';

// Since the text content is taken from the bottom footnotes, it contains an arrow at the end that needs to be removed
// when the content is displayed within the embedded footnote.
const sanitizeContent = (content) => content.substring(0, content.length - 3).trimEnd();

window.onload = () => {
    const hugoFootnotes = Array.from(document.querySelectorAll("[id^='fnref']"));

    if (hugoFootnotes.length === 0) return;

    hugoFootnotes.forEach((hugoFootnote, index) => {
        const textContent = document.getElementById(`fn:${index + 1}`).textContent;

        render(
            <Footnote index={index + 1} id={hugoFootnote.id}>
                {sanitizeContent(textContent)}
            </Footnote>,
            hugoFootnote.parentElement,
            hugoFootnote
        );

        // Manually remove the Hugo rendered footnote since Preact doesn't do it as part of the render() method.
        hugoFootnote.remove();
    });
};
