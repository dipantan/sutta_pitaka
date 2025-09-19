const cssStyles = `<style>
  * {
    font-family: Arial, Helvetica, sans-serif;
  }
    .segment {
    display: grid;
    grid-template-columns: minmax(200px, 720px);
    margin-top: 10;
}
    .translation {
    grid-column: 1;
   
}
    .translation {
    order: 2;
}
    .root {
    grid-column: 1;
}
    .root {
     order: 1;
     color: #ccc;
     margin-bottom: 10;
     font-size: 14px
}
     .translation .text {
    color: var(--sc-on-primary-secondary-text-color);
    font-family: var(--sc-sans-font);
}
    .comment, .variant {
    overflow: hidden;
    width: 1ex;
    height: 1em;
    padding: 0 6px 0 0;
    white-space: nowrap;
    border: none;
    background-color: inherit;
}
    .comment, .variant {
    font-family: var(--sc-sans-font);
    font-size: var(--sc-font-size-s);
    font-weight: 400;
    font-style: normal;
    line-height: 1.3333;
    z-index: 10;
    display: inline-block;
    box-sizing: border-box;
    padding: var(--sc-size-sm) var(--sc-size-md);
    text-align: left;
    text-indent: 0;
    text-transform: none;
    letter-spacing: normal;
    color: var(--sc-on-tertiary-secondary-text-color);
    border-radius: var(--sc-mid-border-radius);
    background-color: var(--sc-tertiary-background-color);
    font-variant-caps: normal;
}
    .comment::before {
    color: #5aa8f2;
}
    .comment::before, .variant::before {
    line-height: 1;
    content: '* ';
    vertical-align: super;
    font-weight: 800;
    font-size: 24px
}
    .ref {
    display: none;
    }
    .evam {
        letter-spacing: var(--sc-caps-letter-spacing);
        font-variant-caps: all-small-caps;
    }
        .sc-text-page-selector {
    font-family: var(--sc-serif-font);
    font-weight: 400;
    line-height: 1.5;
    color: var(--sc-on-primary-primary-text-color);
    display: flex;
    flex-direction: column;
}
        <!---->
  section,
  article {
    max-width: 720px;
  }

  .image-link {
    cursor: pointer;
  }

  .image-book-link {
    margin-bottom: 0.5em;
    margin-left: 0.2em;
  }

  .image-book-link:before {
    display: none;
  }

  .text-center {
    text-align: center;
  }

  .margin-top-xl {
    margin-top: var(--sc-size-xl);
  }

  article p,
  .word,
  .translated-text,
  .original-text {
    transition: background-color 300ms ease-in;
  }

  p,
  li {
    hanging-punctuation: first last;
  }

  @media (max-width: 428px) {
    section,
    article {
      max-width: 320px;
    }
  }

        <!---->
  /* includes all text styles found in one or more of static, legacy, or bilara */
  :host {
    font-family: var(--sc-serif-font);
    font-weight: 400;
    line-height: 1.5;

    color: var(--sc-on-primary-primary-text-color);
  }

  main {
    display: flex;

    justify-content: center;
  }

  main > article,
  div > article,
  .range {
    margin: 0 1em;
  }

  /* text block elements */

  ul,
  ol,
  dt,
  p,
  figure,
  pre {
    margin: 0.75em 0 0 0;
  }

  li::marker {
    font-family: var(--sc-sans-font);
    font-weight: 600;

    color: var(--sc-icon-color);

    font-feature-settings: 'tnum', 'onum';
  }

  hr {
    width: 33%;
    height: 0;
    margin: 1.5em auto;

    border: 0;
    border-bottom: 1px solid var(--sc-on-primary-secondary-text-color);
  }

  /* headings */

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.25;

    margin: 1em 0 0 0;

    color: var(--sc-on-primary-secondary-text-color);
  }

  h1 {
    font-size: var(--sc-font-size-xxxxl);
    font-weight: 400;
    text-wrap: balance;
  }

  h2 {
    font-size: var(--sc-font-size-xxxl);
    font-weight: 400;
  }

  h3 {
    font-size: var(--sc-font-size-xxl);
    font-weight: 400;
  }

  h4 {
    font-size: var(--sc-font-size-xl);
    font-weight: 400;
  }

  h5 {
    font-size: var(--sc-font-size-l);
    font-weight: 600;
  }

  h6 {
    font-size: var(--sc-font-size-md);
    font-style: italic;
  }

  /*sutta title */

  header {
    margin-bottom: 4rem;

    text-align: center;

    color: var(--sc-on-primary-secondary-text-color);
  }

  header ul {
    font-weight: 500;

    display: block;

    margin: 0;
    padding: 0;

    list-style-type: none;

    letter-spacing: var(--sc-caps-letter-spacing);

    font-variant-caps: all-small-caps;
  }

  header h1 {
    margin-top: 0.5rem;

    letter-spacing: var(--sc-caps-letter-spacing);

    font-variant-caps: small-caps;
  }

  /* table of contents */

  .contents {
    margin: 4em 0;

    border-left: 4px solid var(--sc-primary-color-light);
    border-radius: 4px;
  }

  .contents ul {
    list-style-type: none;
  }

  .contents ol {
    margin: 0 0 0 2rem;
    padding: 0 0 0 1rem;
  }

  .contents li {
    font-family: var(--sc-serif-font);
    font-size: var(--sc-font-size-md);
    font-weight: 400;

    margin: 0.5em 0;
  }

  .contents a {
    padding: 8px 16px 6px;

    text-decoration: none;

    color: inherit;
    border-radius: 18px;
    transition: var(--sc-link-transition);
    background-color: inherit;
  }

  .contents a:hover {
    transition: var(--sc-link-transition);
    text-decoration: none;

    background-color: var(--sc-primary-color-light-transparent);
  }

  .contents a:active {
    background-color: var(--sc-primary-color-light);
  }

  /* tables */

  table {
    margin: 2em auto 1em;

    border-collapse: collapse;
  }

  caption {
    font-weight: 600;

    padding: 1em;
  }

  td {
    padding: 0.6667em;

    vertical-align: text-top;

    border-top: var(--sc-border);
    border-bottom: var(--sc-border);
  }

  td:first-child {
    font-weight: bold;
  }

  /* lists */

  ol,
  ul {
    padding-left: 1em;
  }

  ol ul,
  ul ol,
  ul ul,
  ol ol {
    margin: 0.5em 0 0;
  }

  li {
    padding: 0;
  }

  dt {
    font-weight: bold;
  }

  dd {
    margin-left: 1em;
  }

  dd ol,
  dd ul {
    padding-left: 0;
  }

  /* links */

  h1 a,
  h2 a,
  h3 a,
  h4 a,
  h5 a,
  h6 a {
    text-decoration: none;
  }

  /* static endnotes */

  @supports (font-variant-position: super) {
    a[role='doc-noteref'] {
      font-family: var(--sc-sans-font);
      font-weight: 600 !important;
      font-style: normal !important;
      line-height: 1;

      display: inline-block;

      height: 0.55em;
      margin-top: -0.15em;
      padding: 0.1em 0.2em;

      text-decoration: none;

      color: var(--sc-on-primary-secondary-text-color);
      border: 0.15em solid var(--sc-primary-color-light);
      border-radius: 50%;

      font-variant-position: super;
    }
  }

  @supports not (font-variant-position: super) {
    a[role='doc-noteref'] {
      font-family: var(--sc-sans-font);
      font-size: var(--sc-font-size-xs);
      font-weight: 600 !important;
      font-style: normal !important;
      line-height: 1;

      padding: 0 0.2em;

      vertical-align: super;
      text-decoration: none;

      color: var(--sc-on-primary-secondary-text-color);
      border: 0.15em solid var(--sc-primary-color-light);
      border-radius: 50%;
    }
  }

  a[role='doc-backlink'] {
    font-family: var(--sc-sans-font);
    font-size: 0;

    padding: 0 0.2em;

    text-decoration: none;

    color: var(--sc-on-primary-secondary-text-color);
  }

  /* use this pseudoelement together with the size 0 font hack because Skolar does not have the backlink character, but it does have a bunch of arrows in the PUA, so use one of them instead */

  a[role='doc-backlink']::after {
    font-size: var(--sc-font-size-l);

    content: '󰈀';
  }

  a[role='doc-noteref']:hover,
  a[role='doc-backlink']::hover {
    text-decoration: none
  }

  section[role='doc-endnotes'] {
    position: relative;

    margin-top: 3em;
    padding-top: 1em;
  }

  section[role='doc-endnotes']::before {
    position: absolute;
    top: 0;
    left: 0;

    width: 50%;
    height: 1px;

    content: ' ';

    border-top: 1px solid var(--sc-icon-color);
  }

  /* descriptive classes used in bilara and legacy texts */

  .evam {
    letter-spacing: var(--sc-caps-letter-spacing);

    font-variant-caps: all-small-caps;
  }

  .namo {
    font-style: italic;

    text-align: center;
  }

  .roman-numerals {
    text-decoration: underline overline;
    letter-spacing: var(--sc-caps-letter-spacing);
    text-transform: uppercase;

    text-decoration-thickness: 0.05em;
    text-underline-offset: 0.2em;
  }

  .speaker {
    font-style: italic;

    display: block;

    text-indent: 3em;
  }

  .pe {
    font-style: italic;

    color: var(--sc-on-primary-secondary-text-color);
  }

  .expansion-instructions {
    font-style: italic;

    color: var(--sc-on-primary-secondary-text-color);
  }

  .add {
    color: var(--sc-on-primary-secondary-text-color);
  }

  /* end of section */

  .endsection,
  .end,
  .endsubsection {
    font-style: italic;

    text-align: center;

    color: var(--sc-on-primary-secondary-text-color);
  }

  .endsutta {
    font-weight: bold;

    text-align: center;

    color: var(--sc-on-primary-secondary-text-color);
  }

  .endbook,
  .endvagga,
  .endkanda {
    text-align: center;
    letter-spacing: var(--sc-caps-letter-spacing);
    text-transform: uppercase;

    color: var(--sc-on-primary-secondary-text-color);
  }

  [lang='si'] .endbook,
  [lang='zh'] .endbook,
  [lang='si'] .endvagga {
    letter-spacing: normal;
    text-transform: none;

    font-variant-caps: normal;
  }

  .endbook {
    font-weight: bold;
  }

  /* uddana */

  .uddana {
    font-family: var(--sc-sans-font);
    font-size: var(--sc-font-size-s);
    font-weight: 400;

    color: var(--sc-on-primary-secondary-text-color);
  }

  .uddana-intro {
    font-weight: bold;

    color: var(--sc-on-primary-secondary-text-color);
  }

  .uddanagatha {
    font-family: var(--sc-sans-font);
    font-size: var(--sc-font-size-s);
    font-weight: 400;
    font-style: inherit;

    color: var(--sc-on-primary-secondary-text-color);
  }

  /* descriptive classes for metadata*/

  .author {
    letter-spacing: var(--sc-caps-letter-spacing);

    font-variant-caps: small-caps;
  }

  .ref {
    font-family: var(--sc-sans-font);
    font-weight: 600;
    font-style: normal;

    white-space: nowrap;
    letter-spacing: normal;

    color: var(--sc-on-primary-secondary-text-color);

    font-variant-caps: normal;
  }

  footer {
    display: none;
  }

  /* style highlighted text, see  zz3/zz/test and zz1/zz/test*/

  /* Vinaya classes */

  .kamma {
    font-weight: 600;
  }

  .highlight .kamma {
    position: relative;

    margin: 0 -0.25em;
    padding: 0 0.25em;

    outline: 2px solid var(--sc-secondary-accent-color);
  }

  .rule {
    font-weight: 800;
  }

  .subrule {
    font-weight: 600;
  }

  .highlight .cakka {
    color: var(--sc-secondary-accent-color);
  }

  .highlight .anapatti {
    font-weight: 500;
  }

  .highlight .nidana {
    color: var(--sc-primary-accent-color);
  }

  .highlight .patimokkha p {
    position: relative;

    margin: 0 -0.25em;
    padding: 0 0.25em;

    outline: 2px solid var(--sc-toast-error-color);
  }

  .highlight :not(.patimokkha) .rule {
    position: relative;

    margin: 0 -0.25em;
    padding: 0 0.25em;

    outline: 2px dotted var(--sc-toast-error-color);
  }

  .highlight .suttanta {
    position: relative;

    margin: 0 -0.25em;
    padding: 0 0.25em;

    outline: 2px solid var(--sc-primary-color-light);
  }

  .highlight .jataka {
    position: relative;

    margin: 0 -0.25em;
    padding: 0 0.25em;

    outline: 2px solid var(--sc-primary-accent-color-light);
  }

  .highlight .patimokkha p::before,
  .highlight :not(.patimokkha) .rule::before,
  .highlight .kamma::before,
  .highlight .suttanta::before,
  .highlight .jataka::before {
    font-family: var(--sc-sans-font);
    font-size: var(--sc-font-size-s);
    font-weight: 400;
    font-style: normal;
    line-height: 1.3333;

    position: absolute;
    z-index: 10;
    top: -36px;
    left: 0;

    display: inline-block;
    visibility: hidden;

    box-sizing: border-box;
    height: 36px;
    padding: var(--sc-size-sm) var(--sc-size-md);
    padding: var(--sc-size-sm) var(--sc-size-md);

    text-align: left;
    white-space: normal;
    letter-spacing: normal;

    color: var(--sc-on-primary-secondary-text-color);
    color: var(--sc-on-primary-secondary-text-color);
    border-width: 0 0 0 8px;
    border-style: solid;
    border-color: var(--sc-primary-color);
    border-radius: var(--sc-size-sm);
    background-color: var(--sc-secondary-background-color);
    box-shadow: var(--sc-shadow-elevation-8dp);

    font-variant-caps: normal;
  }

  .highlight .patimokkha p::before {
    content: 'This text is included in the patimokkha recitation';
  }

  .highlight :not(.patimokkha) .rule::before {
    content: 'This rule is not included in the patimokkha recitation';
  }

  .highlight .kamma::before {
    content: 'This text is a formal legal statement of the Sangha';
  }

  .highlight .suttanta::before {
    content: 'This text is found also in the Discourses (Sutta)';
  }

  .highlight .jataka::before {
    content: 'This text is a story of the Buddha’s past lives (Jātaka)';
  }

  .highlight :hover::before,
  .highlight .patimokkha p:hover::before,
  .highlight :not(.patimokkha) .rule:hover::before {
    visibility: visible;
  }

  .highlight .padabhajaniya {
    margin: 0 -0.25em;
    padding: 0 0.25em;

    background-color: var(--sc-tertiary-background-color);
  }

  .highlight .vinaya-vinita {
    color: var(--sc-primary-accent-color);
  }

  .help-heading,
  .inserted-heading {
    font-style: italic;
  }

  /* descriptive classes */

  .xu {
    font-size: var(--sc-dense-font-size-s);

    margin-bottom: 4rem;
    padding: 1rem;

    color: var(--sc-on-primary-secondary-text-color);
    border: var(--sc-border);
    border-radius: var(--sc-size-s);
    background-color: var(--sc-tertiary-background-color);
  }

  .suttainfo {
    display: inline-block;

    margin-bottom: 2rem;
    padding: 1rem;

    color: var(--sc-on-primary-secondary-text-color);
    border: var(--sc-border);
    border-radius: var(--sc-size-s);
    background-color: var(--sc-tertiary-background-color);
  }

  .suppliedmetre {
    color: var(--sc-on-primary-secondary-text-color);
  }

  .gap {
    color: var(--sc-on-primary-secondary-text-color);
  }

  .describe {
    text-decoration: line-through;

    text-decoration-color: var(--sc-on-primary-secondary-text-color);
  }

  .del {
    text-decoration: line-through;

    text-decoration-color: var(--sc-on-primary-secondary-text-color);
  }

  .scribe {
    font-style: italic;
  }

  .alt-title {
    display: none;
  }

  .hidden {
    display: none;
  }

  .metre {
    display: none;
  }

  .t-gaiji {
    color: var(--sc-primary-accent-color);
  }

  .rule-number {
    color: var(--sc-on-primary-secondary-text-color);
  }

  .allowance {
    font-weight: bold;
  }

  .t-note {
    color: var(--sc-on-primary-secondary-text-color);
  }

  .vagga-number {
    color: var(--sc-on-primary-secondary-text-color);
  }

  .counter {
    font-family: var(--sc-sans-font);
    font-size: var(--sc-dense-font-size-s);
    font-weight: 400;

    color: var(--sc-on-primary-secondary-text-color);
  }

  .term {
    font-weight: bold;
  }

  .highlight .orthodox::before {
    content: '☑';

    color: var(--sc-toast-success-color);
  }

  .highlight .heterodox::before {
    content: '☒ ';

    color: var(--sc-toast-error-color);
  }

  .highlight .term {
    color: var(--sc-primary-accent-color);
  }

  .highlight .gloss {
    color: var(--sc-primary-accent-color);
  }

  .highlight .surplus {
    color: var(--sc-secondary-accent-color);
  }

  .highlight .supplied {
    color: var(--sc-primary-color);
  }

  .highlight .expanded {
    color: var(--sc-on-primary-secondary-text-color);
  }

  .highlight .var {
    color: var(--sc-secondary-accent-color);
  }

  .highlight .corr,
  .highlight .corrected {
    color: var(--sc-primary-accent-color);
  }

  .highlight .unclear {
    color: var(--sc-on-primary-secondary-text-color);
  }

  .highlight .metre {
    font-size: var(--sc-font-size-xxs);

    position: absolute;

    display: inline-block;

    margin-top: -11px;

    letter-spacing: 0.2em;

    color: var(--sc-primary-accent-color);
  }

  #simple_text_content .ref {
    display: none;
  }

  #simple_text_content .legacy-reference .ref {
    font-family: var(--sc-sans-font);
    font-size: var(--sc-font-size-xxs);
    font-weight: 400;
    font-style: normal;

    display: inline-block;

    box-sizing: border-box;
    margin: 0 4px;
    padding: 0.1em 4px;

    text-align: left;
    white-space: nowrap;
    text-decoration: none;
    letter-spacing: normal;

    color: var(--sc-on-primary-secondary-text-color);
    border: 1px solid var(--sc-border-color);
    border-radius: 8px;
    background-color: var(--sc-secondary-background-color);

    font-variant-caps: normal;
  }

  /* helper metadata in HTML data- */

  .highlight [data-counter]::after {
    font-family: var(--sc-sans-font);
    font-size: var(--sc-font-size-xs);
    font-weight: 600;

    margin: 0 0 0 0.5rem;
    padding: 0 0.25rem;

    color: white;
    border-radius: 4px;
    background-color: var(--sc-icon-color);
  }

  .highlight [data-counter]::after {
    content: attr(data-counter);
  }

  .highlight [data-doxy]::before {
    font-family: var(--sc-sans-font);
    font-size: var(--sc-font-size-xs);
    font-weight: 600;

    margin: 0 0.5rem 0 0;
  }

  .highlight [data-doxy='orthodox']::before {
    content: '👍🏿';
  }

  .highlight [data-doxy='heterodox']::before {
    content: '👎🏽';
  }

  .highlight [data-direction]::before {
    font-family: var(--sc-sans-font);
    font-size: var(--sc-font-size-xs);
    font-weight: 600;

    margin: 0 0.5rem 0 0;
  }

  .highlight [data-direction='forward']::before {
    content: '👉🏾';

    color: var(--sc-icon-color);
  }

  .highlight [data-direction='reverse']::before {
    content: '👈🏼';

    color: var(--sc-icon-color);
  }

        <!---->
  /* styles unique to legacy texts */

  /* sutta title */

  .subheading {
    font-style: italic;
  }

  /*bilingual sutta title*/

  .mirror {
    display: table;

    margin-right: auto;
    margin-left: auto;
  }
  .mirror > * {
    display: table-row;
  }
  .mirror-left {
    display: table-cell;

    width: 50%;
    padding-right: 1rem;

    text-align: right;

    border-right: var(--sc-border);
  }
  .mirror-right {
    display: table-cell;

    padding-left: 1rem;

    text-align: left;
  }
  .mirror-middle {
    position: absolute;

    margin-top: 0.2rem;

    text-align: right;
  }

  .text-table td:first-child {
    font-weight: inherit;
  }

  .spanFocused {
    color: rgb(34, 33, 32);
    background-color: var(--sc-primary-color-light);
  }

  .verse-line{
    display: block
  }

        <!---->
  /* styles for texts with scripts other than latin */

  /* Firefox & Safari use the font-synthesis property to remove faux italics  or bold. 
  Note that vi is excluded from this list: it uses Roman font but qualifies as tall script due to the stacked diacriticals */

  [lang='ar'] *,
  [lang='bn'] *,
  [lang='fa'] *,
  [lang='he'] *,
  [lang='hi'] *,
  [lang='gu'] *,
  [lang='jpn'] *,
  [lang='ko'] *,
  [lang='lzh'] *,
  [lang='mr'] *,
  [lang='my'] *,
  [lang='si'] *,
  [lang='ta'] *,
  [lang='th'] *,
  [lang='xct'] *,
  [lang='zh'] * {
    font-style: normal;

    letter-spacing: normal;
    text-transform: none;

    font-synthesis: none;
    font-variant-caps: normal;
  }

  [lang='ar'] *,
  [lang='bn'] *,
  [lang='fa'] *,
  [lang='he'] *,
  [lang='hi'] *,
  [lang='gu'] *,
  [lang='jpn'] *,
  [lang='ko'] *,
  [lang='lzh'] *,
  [lang='mr'] *,
  [lang='si'] *,
  [lang='ta'] *,
  [lang='th'] *,
  [lang='vi'] *,
  [lang='xct'] *,
  [lang='zh'] {
    line-height: 1.6667;
  }

  [lang='ar'] h1,
  [lang='bn'] h1,
  [lang='fa'] h1,
  [lang='he'] h1,
  [lang='hi'] h1,
  [lang='gu'] h1,
  [lang='jpn'] h1,
  [lang='ko'] h1,
  [lang='lzh'] h1,
  [lang='mr'] h1,
  [lang='si'] h1,
  [lang='ta'] h1,
  [lang='th'] h1,
  [lang='xct'] h1,
  [lang='zh'] h1,
  [lang='ar'] h2,
  [lang='bn'] h2,
  [lang='fa'] h2,
  [lang='he'] h2,
  [lang='hi'] h2,
  [lang='gu'] h2,
  [lang='jpn'] h2,
  [lang='ko'] h2,
  [lang='lzh'] h2,
  [lang='mr'] h2,
  [lang='si'] h2,
  [lang='ta'] h2,
  [lang='th'] h2,
  [lang='xct'] h2,
  [lang='zh'] h2 {
    font-weight: bold;
  }

  [lang='my'] * {
    line-height: 2;
  }

  [lang='ar'] {
    font-family: var(--sc-arabic-serif-font);
  }
  [lang='bn'] {
    font-family: var(--sc-bengali-serif-font);
  }
  [lang='fa'] {
    font-family: var(--sc-arabic-serif-font);
  }
  [lang='he'] {
    font-family: var(--sc-hebrew-serif-font);
  }
  [lang='hi'] {
    font-family: var(--sc-devanagari-serif-font);
  }
  [lang='gu'] {
    font-family: var(--sc-gujarati-serif-font);
  }
  [lang='jpn'] {
    font-family: var(--sc-japanese-font);
  }
  [lang='ko'] {
    font-family: var(--sc-korean-font);
  }
  [lang='lzh'] {
    font-family: var(--sc-traditional-chinese-font);
  }
  [lang='mr'] {
    font-family: var(--sc-devanagari-serif-font);
  }
  [lang='my'] {
    font-family: var(--sc-myanmar-serif-font);
  }
  [lang='si'] {
    font-family: var(--sc-sinhala-serif-font);
  }
  [lang='ta'] {
    font-family: var(--sc-tamil-serif-font);
  }
  [lang='th'] {
    font-family: var(--sc-thai-serif-font);
  }
  [lang='xct'] {
    font-family: var(--sc-tibetan-font);
  }
  [lang='zh'] {
    font-family: var(--sc-traditional-chinese-font);
  }

  /* don't let Pali/sanskrit words go too long, probably won't work but oh well */

  [lang='pli'],
  [lang='san'] {
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  [lang='ko'] * {
    font-synthesis: none;
  }

      <!----></style>`;

const commentWrapper = `
      <style>
        a {
          pointer-events: none; /* Prevents clicks/taps */
          color: #fff; /* Gray color to indicate disabled state */
          text-decoration: none; /* Remove underline */
          cursor: default; /* Default cursor instead of pointer */
          opacity: 0.6; /* Slightly faded appearance */
        }

        * {
          font-color: #fff;
          font-family: Arial, Helvetica, sans-serif;
          line-height: 1.6;
        }
      
      </style>
      `;

const searchStyle = `<style>
:root {
        font-family: var(--sc-sans-font), 'Noto Sans', 'Source Sans Pro', sans-serif;
      }

      html,
      body {
        height: 100%;
      }

      body {
        margin: 0;
        background-color: var(--sc-primary-background-color);
        color: var(--sc-on-primary-primary-text-color);
        overflow-y: scroll;
        overflow-x: hidden;
      }

      .unsupported-browser-splash-screen {
        height: 100%;
        width: 100%;
        background-color: #f5f5f5;
        color: rgb(33, 33, 33);
        text-align: center;
        font-family: var(--sc-sans-font);
      }

      .center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .margin-md {
        margin: 32px;
      }

      .hidden {
        display: none;
      }

      button {
        background: none;
        border: none;
        padding: 0 ;
        color: rgba(206, 132, 0, 1);
        font-family: 'Skolar Sans PE', 'Noto Sans', sans-serif;
        cursor: pointer;
        font-size: 16px;
      }

  html {
    --sc-screen-sm: 600px;
    --sc-screen-md: 840px;
    --sc-screen-l: 960px;
    --sc-screen-xl: 1280px;

    --sc-size-xxs: 2px;
    --sc-size-xs: 4px;
    --sc-size-sm: 8px;
    --sc-size-md: 16px;
    --sc-size-md-larger: 24px;
    --sc-size-lg: 32px;
    --sc-size-xl: 48px;
    --sc-size-xxl: 64px;

    --sc-container-margin: 3vw;

    --sc-size-language-icon: 19px;

    --sc-border: 1px solid var(--sc-border-color);

    --sc-mid-border-radius: 16px;
    --sc-big-border-radius: 24px;

    --sc-umbra-opacity: rgba(0, 0, 0, 0.1);
    --sc-penumbra-opacity: rgba(0, 0, 0, 0.07);
    --sc-ambient-opacity: rgba(0, 0, 0, 0.06);

    --sc-shadow-elevation-0dp: 0px 0px 0px 0px var(--sc-umbra-opacity),
      0px 0px 0px 0px var(--sc-penumbra-opacity), 0px 0px 0px 0px var(--sc-ambient-opacity);

    --sc-shadow-elevation-1dp: 0px 2px 1px -1px var(--sc-umbra-opacity),
      0px 1px 1px 0px var(--sc-penumbra-opacity), 0px 1px 3px 0px var(--sc-ambient-opacity);

    --sc-shadow-elevation-2dp: 0px 3px 1px -2px var(--sc-umbra-opacity),
      0px 2px 2px 0px var(--sc-penumbra-opacity), 0px 1px 5px 0px var(--sc-ambient-opacity);

    --sc-shadow-elevation-4dp: 0px 2px 4px -1px var(--sc-umbra-opacity),
      0px 4px 5px 0px var(--sc-penumbra-opacity), 0px 1px 10px 0px var(--sc-ambient-opacity);

    --sc-shadow-elevation-8dp: 0px 5px 5px -3px var(--sc-umbra-opacity),
      0px 8px 10px 1px var(--sc-penumbra-opacity), 0px 3px 14px 2px var(--sc-ambient-opacity);

    --sc-shadow-elevation-12dp: 0px 7px 8px -4px var(--sc-umbra-opacity),
      0px 12px 17px 2px var(--sc-penumbra-opacity), 0px 5px 22px 4px var(--sc-ambient-opacity);

    --sc-shadow-elevation-16dp: 0px 8px 10px -5px var(--sc-umbra-opacity),
      0px 16px 24px 2px var(--sc-penumbra-opacity), 0px 6px 30px 5px var(--sc-ambient-opacity);

    --sc-shadow-elevation-24dp: 0px 11px 15px -7px var(--sc-umbra-opacity),
      0px 24px 38px 3px var(--sc-penumbra-opacity), 0px 9px 46px 8px var(--sc-ambient-opacity);

    --sc-suttaplex-shadow: var(--sc-shadow-elevation-4dp);

    --sc-suttaplex-padding: var(--sc-size-md);

    --sc-link-transition: background-color 300ms ease, border-bottom 300ms ease, opacity 300ms ease,
      text-decoration-thickness 300ms ease;
  }

  /* inline links */

  .link-button {
    font-family: var(--sc-sans-font);
    font-size: var(--sc-font-size-s);
    font-weight: 550;
    line-height: 1;

    display: inline-flex;

    box-sizing: border-box;
    min-width: 64px;
    height: 40px;
    padding: 0 24px;

    text-decoration: none;

    color: var(--sc-on-primary-primary-text-color);
    border: 2px solid var(--sc-border-color);
    border-radius: var(--sc-big-border-radius);
    background-color: inherit;

    align-items: center;
    justify-content: center;
  }
  p a,
  li a,
  dl a,
  table a {
    transition: var(--sc-link-transition);
    text-decoration: underline;

    color: inherit;

    text-decoration-color: var(--sc-primary-color-light);
    text-decoration-thickness: 2px;
    text-underline-offset: 0.15em;
  }

  p a:hover,
  li a:hover,
  dl a:hover,
  table a:hover {
    transition: var(--sc-link-transition);
    text-decoration: underline;

    color: inherit;

    text-decoration-color: var(--sc-primary-color-light);
    text-decoration-thickness: 4px;
    text-underline-offset: 0.15em;
  }

  p a:active,
  li a:active,
  dl a:active,
  table a:active {
    text-decoration-color: var(--sc-primary-color);
  }

  p a:visited,
  li a:visited,
  dl a:visited,
  table a:visited {
    text-decoration-color: var(--sc-primary-color-dark);
  }

  /* block links */

  .block-link,
  .entry-list a,
  .features-section a,
  .reference a {
    transition: var(--sc-link-transition);
    text-decoration: none;

    color: inherit;
    background-color: inherit;
  }

  .block-link:hover,
  .entry-list a:hover,
  .features-section a:hover,
  .reference a:hover {
    transition: var(--sc-link-transition);
    text-decoration: none;

    background-color: var(--sc-primary-color-light-transparent);
  }

  .block-link:active,
  .entry-list a:active,
  .features-section a:active,
  .reference a:active {
    background-color: var(--sc-primary-color-light);
  }


  @font-face {
    font-family: 'Skolar PE Variable';
    src: url('/files/fonts/SkolarPEVFWeb-Ups.woff2') format('woff2-variations');
    font-weight: 100 1000;
    font-style: normal;
    font-stretch: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Skolar PE Variable';
    src: url('/files/fonts/SkolarPEVFWeb-Its.woff2') format('woff2-variations');
    font-weight: 100 1000;
    font-style: italic;
    font-stretch: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Skolar Sans PE Variable';
    src: url('/files/fonts/SkolarSansPEVFWeb-Ups.woff2') format('woff2-variations');
    font-weight: 100 1000;
    font-style: normal;
    font-stretch: 80% 115%;
    font-display: swap;
  }

  @font-face {
    font-family: 'Skolar Sans PE Variable';
    src: url('/files/fonts/SkolarSansPEVFWeb-Its.woff2') format('woff2-variations');
    font-weight: 100 1000;
    font-style: italic;
    font-stretch: 80% 115%;
    font-display: swap;
  }

  @font-face {
    font-family: 'Skolar Devanagari';
    src: url('/files/fonts/RaloksDevanagari-Regular_3.007.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Skolar Devanagari';
    src: url('/files/fonts/RaloksDevanagari-Bold_3.007.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Serif Thai';
    src: local('Noto Serif Thai Regular'), local('NotoSerifThai-Regular'),
      url('/files/fonts/NotoSerifThai-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Serif Myanmar';
    src: local('Noto Serif Myanmar Bold'), local('NotoSerifMyanmar-Bold'),
      url('/files/fonts/NotoSerifMyanmar-Bold.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans';
    src: local('Noto Sans Bold'), local('NotoSans-Bold'),
      url('/files/fonts/NotoSans-Bold.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans';
    src: local('Noto Sans Regular'), local('NotoSans-Regular'),
      url('/files/fonts/NotoSans-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Myanmar';
    src: local('Noto Sans Myanmar Regular'), local('NotoSansMyanmar-Regular'),
      url('/files/fonts/NotoSansMyanmar-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Devanagari';
    src: local('Noto Sans Devanagari Regular'), local('NotoSansDevanagari-Regular'),
      url('/files/fonts/NotoSansDevanagari-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Hebrew';
    src: local('Noto Sans Hebrew Bold'), local('NotoSansHebrew-Bold'),
      url('/files/fonts/NotoSansHebrew-Bold.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Tamil';
    src: local('Noto Sans Tamil Bold'), local('NotoSansTamil-Bold'),
      url('/files/fonts/NotoSansTamil-Bold.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Arabic';
    src: local('Noto Sans Arabic Regular'), local('NotoSansArabic-Regular'),
      url('/files/fonts/NotoSansArabic-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Serif Hebrew';
    src: local('Noto Serif Hebrew Bold'), local('NotoSerifHebrew-Bold'),
      url('/files/fonts/NotoSerifHebrew-Bold.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Serif Sinhala';
    src: local('Noto Serif Sinhala Regular'), local('NotoSerifSinhala-Regular'),
      url('/files/fonts/NotoSerifSinhala-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Tibetan';
    src: local('Noto Sans Tibetan'), local('NotoSansTibetan'),
      url('/files/fonts/NotoSansTibetan.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Sinhala';
    src: local('Noto Sans Sinhala Bold'), local('NotoSansSinhala-Bold'),
      url('/files/fonts/NotoSansSinhala-Bold.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Tibetan';
    src: local('Noto Sans Tibetan Bold'), local('NotoSansTibetan-Bold'),
      url('/files/fonts/NotoSansTibetan-Bold.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Tamil';
    src: local('Noto Sans Tamil Regular'), local('NotoSansTamil-Regular'),
      url('/files/fonts/NotoSansTamil-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Serif Tamil';
    src: local('Noto Serif Tamil Bold'), local('NotoSerifTamil-Bold'),
      url('/files/fonts/NotoSerifTamil-Bold.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Serif Tamil';
    src: local('Noto Serif Tamil Regular'), local('NotoSerifTamil-Regular'),
      url('/files/fonts/NotoSerifTamil-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Bengali';
    src: local('Noto Sans Bengali Regular'), local('NotoSansBengali-Regular'),
      url('/files/fonts/NotoSansBengali-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Bengali';
    src: local('Noto Sans Bengali Bold'), local('NotoSansBengali-Bold'),
      url('/files/fonts/NotoSansBengali-Bold.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Serif Bengali';
    src: local('Noto Serif Bengali Bold'), local('NotoSerifBengali-Bold'),
      url('/files/fonts/NotoSerifBengali-Bold.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Serif Bengali';
    src: local('Noto Serif Bengali Regular'), local('NotoSerifBengali-Regular'),
      url('/files/fonts/NotoSerifBengali-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Serif Thai';
    src: local('Noto Serif Thai Bold'), local('NotoSerifThai-Bold'),
      url('/files/fonts/NotoSerifThai-Bold.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Naskh Arabic';
    src: local('Noto Naskh Arabic Bold'), local('NotoNaskhArabic-Bold'),
      url('/files/fonts/NotoNaskhArabic-Bold.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Serif Sinhala';
    src: local('Noto Serif Sinhala Bold'), local('NotoSerifSinhala-Bold'),
      url('/files/fonts/NotoSerifSinhala-Bold.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Serif Myanmar';
    src: local('Noto Serif Myanmar Regular'), local('NotoSerifMyanmar-Regular'),
      url('/files/fonts/NotoSerifMyanmar-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Hebrew';
    src: local('Noto Sans Hebrew Regular'), local('NotoSansHebrew-Regular'),
      url('/files/fonts/NotoSansHebrew-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Thai';
    src: local('Noto Sans Thai Bold'), local('NotoSansThai-Bold'),
      url('/files/fonts/NotoSansThai-Bold.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans';
    src: local('Noto Sans Italic'), local('NotoSans-Italic'),
      url('/files/fonts/NotoSans-Italic.woff2') format('woff2');
    font-weight: normal;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Myanmar';
    src: local('Noto Sans Myanmar Bold'), local('NotoSansMyanmar-Bold'),
      url('/files/fonts/NotoSansMyanmar-Bold.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Devanagari';
    src: local('Noto Sans Devanagari Bold'), local('NotoSansDevanagari-Bold'),
      url('/files/fonts/NotoSansDevanagari-Bold.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Sinhala';
    src: local('Noto Sans Sinhala Regular'), local('NotoSansSinhala-Regular'),
      url('/files/fonts/NotoSansSinhala-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Naskh Arabic';
    src: local('Noto Naskh Arabic'), local('NotoNaskhArabic'),
      url('/files/fonts/NotoNaskhArabic.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Serif Hebrew';
    src: local('Noto Serif Hebrew Regular'), local('NotoSerifHebrew-Regular'),
      url('/files/fonts/NotoSerifHebrew-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Serif';
    src: local('Noto Serif Bold'), local('NotoSerif-Bold'),
      url('/files/fonts/NotoSerif-Bold.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Thai';
    src: local('Noto Sans Thai Regular'), local('NotoSansThai-Regular'),
      url('/files/fonts/NotoSansThai-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Serif';
    src: local('Noto Serif Regular'), local('NotoSerif-Regular'),
      url('/files/fonts/NotoSerif-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Arabic';
    src: local('Noto Sans Arabic Bold'), local('NotoSansArabic-Bold'),
      url('/files/fonts/NotoSansArabic-Bold.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }


  @font-face {
    font-family: 'Noto Sans CJK JP';
    src: url('/files/fonts/noto-sans-jp_regular_jp_462a49732c9d.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans CJK JP';
    src: url('/files/fonts/noto-sans-jp_bold_jp_e5ebd509a112.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans CJK KR';
    src: url('/files/fonts/noto-sans-kr_regular_ko_92fbb158dfd5.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans CJK KR';
    src: url('/files/fonts/noto-sans-kr_bold_ko_94d8d803ed69.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans CJK TC';
    src: url('/files/fonts/noto-sans-tc_regular_zh_lzh_785da7cebd0b.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans CJK TC';
    src: url('/files/fonts/noto-sans-tc_bold_zh_lzh_bbcfc9a4d4b2.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans CJK SC';
    src: url('/files/fonts/noto-sans-sc_regular_zh_lzh_b3bccbd8d25b.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans CJK SC';
    src: url('/files/fonts/noto-sans-sc_bold_zh_lzh_f57371fc2dca.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Source Han Serif TC VF';
    src: url('/files/fonts/SourceHanSerifTC-VF.otf.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'IPAM';
    src: url('/files/fonts/ipam.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Serif Ahom';
    src: url('/files/fonts/NotoSerifAhom-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Ariyaka';
    src: url('/files/fonts/ariyaka.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Avestan';
    src: url('/files/fonts/NotoSansAvestan-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Serif Bali';
    src: url('/files/fonts/NotoSerifBalinese-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Batak';
    src: url('/files/fonts/NotoSansBatak-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Bhaiksuki';
    src: url('/files/fonts/NotoSansBhaiksuki-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Brahmi';
    src: url('/files/fonts/NotoSansBrahmi-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Buhid';
    src: url('/files/fonts/NotoSansBuhid-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Chakma';
    src: url('/files/fonts/NotoSansChakma-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans ChakmaPali';
    src: url('/files/fonts/chakmapali.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Cham';
    src: url('/files/fonts/NotoSansCham-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Serif Dogra';
    src: url('/files/fonts/NotoSerifDogra-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans GunjalaGondi';
    src: url('/files/fonts/NotoSansGunjalaGondi-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans MasaramGondi';
    src: url('/files/fonts/NotoSansMasaramGondi-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Grantha2';
    src: url('/files/fonts/NotoSansGrantha-RegularZach.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Serif Grantha';
    src: url('/files/fonts/NotoSerifGrantha-RegularZach.otf');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Serif Gujarati';
    src: url('/files/fonts/NotoSerifGujarati-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Javanese';
    src: url('/files/fonts/NotoSansJavanese-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Kaithi';
    src: url('/files/fonts/NotoSansKaithi-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Kharoshthi';
    src: url('/files/fonts/NotoSansKharoshthi-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Khojki';
    src: url('/files/fonts/NotoSansKhojki-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Khudawadi';
    src: url('/files/fonts/NotoSansKhudawadi-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Serif Lao Reg';
    src: url('/files/fonts/SerifLao-Reg.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Lepcha';
    src: url('/files/fonts/NotoSansLepcha-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Limbu';
    src: url('/files/fonts/NotoSansLimbu-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Mahajani';
    src: url('/files/fonts/NotoSansMahajani-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Marchen';
    src: url('/files/fonts/NotoSansMarchen-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans MarchenB';
    src: url('/files/fonts/BabelStoneMarchen.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Meetei Mayek';
    src: url('/files/fonts/NotoSansMeeteiMayek-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Modi';
    src: url('/files/fonts/NotoSansModi-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'MQG8F02';
    src: url('/files/fonts/MQG8F02.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Mro';
    src: url('/files/fonts/NotoSansMro-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Multani';
    src: url('/files/fonts/NotoSansMultani-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Newa';
    src: url('/files/fonts/NotoSansNewa-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans PhagsPa';
    src: url('/files/fonts/NotoSansPhagsPa-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Rejang';
    src: url('/files/fonts/NotoSansRejang-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans HanifiRohingya';
    src: url('/files/fonts/NotoSansHanifiRohingya-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Ol Chiki';
    src: url('/files/fonts/NotoSansOlChiki-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Satisar Sharada';
    src: url('/files/fonts/Sharada.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Siddham';
    src: url('/files/fonts/NotoSansSiddham-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans SoraSompeng';
    src: url('/files/fonts/NotoSansSoraSompeng-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Soyombo';
    src: url('/files/fonts/NotoSansSoyombo-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Sundanese';
    src: url('/files/fonts/NotoSansSundanese-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans SylotiNagri';
    src: url('/files/fonts/NotoSansSylotiNagri-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Tagalog';
    src: url('/files/fonts/NotoSansTagalog-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Tagbanwa';
    src: url('/files/fonts/NotoSansTagbanwa-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Takri';
    src: url('/files/fonts/NotoSansTakri-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Adinatha Tamil Brahmi';
    src: url('/files/fonts/AdinathaTamilBrahmi2.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Tai Tham';
    src: url('/files/fonts/NotoSansTaiTham-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Lamphun';
    src: url('/files/fonts/Pali_Khottabun.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'A Tai Tham KH New';
    src: url('/files/fonts/A-Tai-Tham-KH-New-V2.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Pali TaiLue';
    src: url('/files/fonts/Pali_TaiLue.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Tirhuta';
    src: url('/files/fonts/NotoSansTirhuta-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Wancho';
    src: url('/files/fonts/NotoSansWancho-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans WarangCiti';
    src: url('/files/fonts/NotoSansWarangCiti-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Zanabazar Square';
    src: url('/files/fonts/NotoSansZanabazarSquare-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'MithilaUni';
    src: url('/files/fonts/MithilaUni.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'PaliTilok';
    src: url('/files/fonts/Pali_Tilok.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Agastya Extended Tamil';
    src: url('/files/fonts/AgastyaExtendedTamil.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'e-Vatteluttu';
    src: url('/files/fonts/e-VatteluttuOT.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'RanjanaUnicode';
    src: url('/files/fonts/RanjanaUNICODE1.0.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Hanunoo';
    src: url('/files/fonts/NotoSansHanunoo-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Patimokkha';
    src: url('/files/fonts/Patimokkha.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Nastaliq Urdu';
    src: url('/files/fonts/NotoNastaliqUrdu-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'BabelStone PhagsPa TibA';
    src: url('/files/fonts/BabelStonePhagspaTibetanA_v2.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'BabelStone PhagsPa Seal';
    src: url('/files/fonts/BabelStonePhagspaSeal_v1.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Lohit Oriya Vedic';
    src: url('/files/fonts/Lohit-Oriya-Vedic.otf');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Bengali Vedic';
    src: url('/files/fonts/NotoSansBengali-Vedic.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Gujarati Vedic';
    src: url('/files/fonts/NotoSansGujarati-Vedic.otf');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Gurmukhi Vedic';
    src: url('/files/fonts/NotoSansGurmukhi-Vedic.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Mukta Malar Regular';
    src: url('/files/fonts/MuktaMalar-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Tibetan Dbu Med';
    src: url('/files/fonts/Qomolangma-Betsu.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Saurashtra';
    src: url('/files/fonts/NotoSansSaurashtra-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Khamti Regular';
    src: url('/files/fonts/Khamti-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Kannada';
    src: url('/files/fonts/NotoSansKannada-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'TantularKawi';
    src: url('/files/fonts/TantularKawi.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Purnawarman';
    src: url('/files/fonts/adn_Purnawarman_1584765777.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Buginese';
    src: url('/files/fonts/NotoSansBuginese-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Malayalam';
    src: url('/files/fonts/NotoSansMalayalam-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Meera';
    src: url('/files/fonts/Meera-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Telugu';
    src: url('/files/fonts/Lohit-Telugu.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Aazhvaar Telugu';
    src: url('/files/fonts/AazhvaarTelugu.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Khmer';
    src: url('/files/fonts/NotoSerifKhmer-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans OldPersian';
    src: url('/files/fonts/NotoSansOldPersian-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'e-Grantamil';
    src: url('/files/fonts/e-Grantamil.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Agastya Serif';
    src: url('/files/fonts/AgastyaSerif.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Muktamsiddham';
    src: url('/files/fonts/Muktamsiddham.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Kaccayana Thai';
    src: url('/files/fonts/KaccayanaThai.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'e-Pandya';
    src: url('/files/fonts/e-Pandya.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'ApDevaSiddham';
    src: url('/files/fonts/ApDevaSiddham.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'AnnaPurna';
    src: url('/files/fonts/AnnapurnaSIL-TT-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Noto Sans Elymaic';
    src: url('/files/fonts/NotoSansElymaic-Regular.woff2');
    direction: rtl;
  }

  @font-face {
    font-family: 'Noto Sans Hatran';
    src: url('/files/fonts/NotoSansHatran-Regular.woff2');
    direction: rtl;
  }

  @font-face {
    font-family: 'Noto Sans ImperialAramaic';
    src: url('/files/fonts/NotoSansImperialAramaic-Regular.woff2');
    direction: rtl;
  }

  @font-face {
    font-family: 'Noto Sans InscriptionalPahlav';
    src: url('/files/fonts/NotoSansInscriptionalPahlavi-Regular.woff2');
    direction: rtl;
  }

  @font-face {
    font-family: 'Noto Sans InscriptionalParthian';
    src: url('/files/fonts/NotoSansInscriptionalParthian-Regular.woff2');
    direction: rtl;
  }

  @font-face {
    font-family: 'Adn Salapa Jangang';
    src: url('/files/fonts/AdnSalapaJangang.woff2');
  }

  @font-face {
    font-family: 'Noto Sans Manichaean';
    src: url('/files/fonts/NotoSansManichaean-Regular.woff2');
  }

  @font-face {
    font-family: 'Noto Sans Nabataean';
    src: url('/files/fonts/NotoSansNabataean-Regular.woff2');
  }

  @font-face {
    font-family: 'Nandinagari Uni';
    src: url('/files/fonts/NandinagariUni.woff2');
  }

  @font-face {
    font-family: 'Noto Sans OldNorthArabian';
    src: url('/files/fonts/NotoSansOldNorthArabian-Regular.woff2');
  }

  @font-face {
    font-family: 'Noto Sans OldSogdian';
    src: url('/files/fonts/noto-sans-old-sogdian-regular.woff2');
  }

  @font-face {
    font-family: 'Noto Sans OldSouthArabian';
    src: url('/files/fonts/NotoSansOldSouthArabian-Regular.woff2');
  }

  @font-face {
    font-family: 'Noto Sans Palmyrene';
    src: url('/files/fonts/NotoSansPalmyrene-Regular.woff2');
  }

  @font-face {
    font-family: 'Noto Sans Phoenician';
    src: url('/files/fonts/NotoSansPhoenician-Regular.woff2');
  }

  @font-face {
    font-family: 'Noto Sans PsalterPahlavi';
    src: url('/files/fonts/NotoSansPsalterPahlavi-Regular.woff2');
  }

  @font-face {
    font-family: 'Noto Sans Samaritan';
    src: url('/files/fonts/NotoSansSamaritan-Regular.woff2');
  }

  @font-face {
    font-family: 'Noto Sans Sogdian';
    src: url('/files/fonts/NotoSansSogdian-Regular.woff2');
  }

  @font-face {
    font-family: 'Noto Sans Syriac';
    src: url('/files/fonts/NotoSansSyriac-Regular.woff2');
  }

  @font-face {
    font-family: 'Noto Sans Ugaritic';
    src: url('/files/fonts/NotoSansUgaritic-Regular.woff2');
  }

  html {
    --sc-skolar-font-scale: 1.13;

    --sc-tall-font-scale: 1.13;

    --sc-dense-font-scale: 1.13;

    --sc-sans-font: 'Skolar Sans PE Variable', 'Noto Sans', sans-serif;

    --sc-serif-font: 'Skolar PE Variable', 'Noto Serif', 'Skolar Sans PE', 'Noto Sans', serif;

    --sc-monospace-font: 'Source Code Pro', monospace;

    --sc-noto-sans-font: 'Noto Sans', sans-serif;

    --sc-arabic-sans-font: 'Noto Sans Arabic', 'Noto Sans', sans-serif;

    --sc-arabic-serif-font: 'Noto Naskh Arabic', 'Noto Serif', 'Noto Sans Arabic', 'Noto Sans',
      serif;

    --sc-hebrew-sans-font: 'Noto Sans Hebrew', 'Noto Sans', sans-serif;

    --sc-hebrew-serif-font: 'Noto Serif Hebrew', 'Noto Serif', 'Noto Sans Hebrew', 'Noto Sans',
      serif;

    --sc-devanagari-sans-font: 'Noto Sans Devanagari', 'Noto Sans', sans-serif;

    --sc-devanagari-serif-font: 'Skolar Devanagari', 'Skolar PE', 'Noto Serif',
      'Noto Sans Devanagari', 'Noto Sans', serif;

    --sc-gujarati-sans-font: 'Noto Sans Gujarati ', 'Noto Sans', sans-serif;

    --sc-gujarati-serif-font: 'Noto Serif Gujarati', 'Noto Serif', 'Noto Sans Gujarati', 'Noto Sans',
      serif;

    --sc-myanmar-sans-font: 'Noto Sans Myanmar', 'Noto Sans', sans-serif;

    --sc-myanmar-serif-font: 'Noto Serif Myanmar', 'Noto Serif', 'Noto Sans Myanmar', 'Noto Sans',
      serif;

    --sc-sinhala-sans-font: 'Noto Sans Sinhala', 'Noto Sans', sans-serif;

    --sc-sinhala-serif-font: 'Noto Serif Sinhala', 'Noto Serif', 'Noto Sans Sinhala', 'Noto Sans',
      serif;

    --sc-tamil-sans-font: 'Noto Sans Tamil', 'Noto Sans', sans-serif;

    --sc-tamil-serif-font: 'Noto Serif Tamil', 'Noto Serif', 'Noto Sans Tamil', 'Noto Sans', serif;

    --sc-bengali-sans-font: 'Noto Sans Bengali', 'Noto Sans', sans-serif;

    --sc-bengali-serif-font: 'Noto Serif Bengali', 'Noto Serif', 'Noto Sans', serif;

    --sc-thai-sans-font: 'Noto Sans Thai', 'Noto Sans', sans-serif;

    --sc-thai-serif-font: 'Noto Serif Thai', 'Noto Serif', 'Noto Sans Thai', 'Noto Sans', serif;

    --sc-tibetan-font: 'Noto Sans Tibetan', 'Noto Sans', sans-serif;

    --sc-japanese-font: 'IPAM', 'Noto Sans CJK JP', 'Noto Sans', sans-serif;

    --sc-korean-font: 'Noto Sans CJK KR', 'Noto Sans', sans-serif;

    --sc-traditional-chinese-font: 'Source Han Serif TC VF', 'Noto Sans CJK TC', 'Noto Sans', sans-serif;

    --sc-simple-chinese-font: 'Noto Sans CJK SC', 'Noto Sans', sans-serif;

    /* use type scale at 1.2 (per LaTeX) with root size at 1.125 (= 18px) */

    --sc-font-size-xxs: 0.65rem;

    --sc-font-size-xs: 0.78rem;

    --sc-font-size-s: 0.94rem;

    --sc-font-size-md: 1.125rem;

    --sc-font-size-l: 1.35rem;

    --sc-font-size-xl: 1.62rem;

    --sc-font-size-xxl: 1.944rem;

    --sc-font-size-xxxl: 2.33rem;

    --sc-font-size-xxxxl: 2.8rem;

    --sc-caps-letter-spacing: 0.02em;
  }

  /* for small screen, use type scale at 1.125 for larger font sizes, keep smaller sizes the same */

  @media screen and (max-width: 600px) {
    html {
      --sc-font-size-xxs: 0.65rem;

      --sc-font-size-xs: 0.78rem;

      --sc-font-size-s: 0.94rem;

      --sc-font-size-md: 1.125rem;

      --sc-font-size-l: 1.265rem;

      --sc-font-size-xl: 1.424rem;

      --sc-font-size-xxl: 1.6rem;

      --sc-font-size-xxxl: 1.8rem;

      --sc-font-size-xxxxl: 2.03rem;
    }
  }


        <!---->
  sc-site-layout {
    display: flex;
    flex-direction: column;

    min-height: 100%;

    --md-ripple-hover-color: var(--sc-secondary-background-color);
    --md-ripple-pressed-color: var(--md-sys-color-primary);
  }

  /* apply font size here to avoid resizing title when returning to Home */

  .homeTitle {
    display: flex;
    overflow: hidden;
    flex-direction: column;

    box-sizing: border-box;
    height: 180px;
    margin: auto;
    padding-right: 8px;

    white-space: nowrap;
    text-overflow: ellipsis;

    justify-content: center;
  }

  #mainTitle {
    font-size: clamp(2rem, 10vw, 2.8rem);

    display: flex;

    height: 44px;

    justify-content: center;
    align-items: center;
  }

  .homeTitle #mainTitle {
    font-family: var(--sc-serif-font);

    letter-spacing: var(--sc-caps-letter-spacing);

    font-variant-caps: small-caps;
  }

  #mainTitle span {
    margin-top: 4px;
  }

  #subTitle {
    font-size: clamp(0.94rem, 5vw, 1.62rem);
    font-style: italic;

    transition: opacity 0.5s ease-in;

    opacity: 1;
  }

  @media only screen and (max-width: 618px) {
    #subTitle[lang='de'], #subTitle[lang='my'], #subTitle[lang='ru'] {
      white-space: normal;
      font-size: clamp(0.94rem, 3.5vw, 1.4rem);
      text-align: center;
      justify-content: center;
      align-items: center;
    }
  }

  #universal_toolbar {
    position: sticky;
    z-index: 100;
    top: 0;

    color: var(--sc-inverted-text-color);
    background-color: var(--sc-primary-color);
    box-shadow: none;
  }

  #context_toolbar {
    display: flex;

    height: 60px;
    padding: 0 8px 0 16px;

    justify-content: space-between;
  }

  .generalTitle {
    display: flex;
    overflow: hidden;

    height: 60px;

    white-space: nowrap;
    text-overflow: ellipsis;

    align-items: center;
  }

  /* make footer stick to the bottom */
  #site_footer {
    margin-top: auto;
  }

  /* apply font size here to avoid resizing title when returning to Home */
  .generalTitle span {
    font-size: var(--sc-font-size-l);
    font-weight: 600;
    font-stretch: condensed;
  }

  @media print {
    #universal_toolbar,
    #title,
    #site_footer {
      display: none;
    }
  }

  .sc_logo {
    width: 1.25em;
    height: 1.25em;
  }

  @media only screen and (max-width: 300px) {
    .sc_logo {
      width: 0;
      height: 0;
    }

    #mainTitle {
      justify-content: flex-start;
    }
  }

  @media only screen and (max-width: 600px) {
    #context_toolbar.contextToolbarExpand {
      flex-direction: column;

      height: 112px !important;

      justify-content: center;
    }
  }

  .skip-to-content-link {
    position: absolute;
    left: 50%;

    height: 30px;
    padding: 8px;

    transition: transform 0.3s;
    transform: translateY(-100%);

    background: #e77e23;
  }

  .skip-to-content-link:focus {
    transform: translateY(0%);
  }

  .hidden {
    display: none !important;
  }

  md-filled-button {
    --md-sys-color-primary: var(--sc-primary-accent-color);
    --md-sys-color-on-primary: white;
    --md-filled-button-label-text-font: var(--sc-sans-font);
    --md-filled-button-label-text-size: var(--sc-size-md);
  }

  .highlightTitle {
    color: yellow;
  }

        <!---->
  /* styles for texts with scripts other than latin */

  /* Firefox & Safari use the font-synthesis property to remove faux italics  or bold. 
  Note that vi is excluded from this list: it uses Roman font but qualifies as tall script due to the stacked diacriticals */

  [lang='ar'] *,
  [lang='bn'] *,
  [lang='fa'] *,
  [lang='he'] *,
  [lang='hi'] *,
  [lang='gu'] *,
  [lang='jpn'] *,
  [lang='ko'] *,
  [lang='lzh'] *,
  [lang='mr'] *,
  [lang='my'] *,
  [lang='si'] *,
  [lang='ta'] *,
  [lang='th'] *,
  [lang='xct'] *,
  [lang='zh'] * {
    font-style: normal;

    letter-spacing: normal;
    text-transform: none;

    font-synthesis: none;
    font-variant-caps: normal;
  }

  [lang='ar'] *,
  [lang='bn'] *,
  [lang='fa'] *,
  [lang='he'] *,
  [lang='hi'] *,
  [lang='gu'] *,
  [lang='jpn'] *,
  [lang='ko'] *,
  [lang='lzh'] *,
  [lang='mr'] *,
  [lang='si'] *,
  [lang='ta'] *,
  [lang='th'] *,
  [lang='vi'] *,
  [lang='xct'] *,
  [lang='zh'] {
    line-height: 1.6667;
  }

  [lang='ar'] h1,
  [lang='bn'] h1,
  [lang='fa'] h1,
  [lang='he'] h1,
  [lang='hi'] h1,
  [lang='gu'] h1,
  [lang='jpn'] h1,
  [lang='ko'] h1,
  [lang='lzh'] h1,
  [lang='mr'] h1,
  [lang='si'] h1,
  [lang='ta'] h1,
  [lang='th'] h1,
  [lang='xct'] h1,
  [lang='zh'] h1,
  [lang='ar'] h2,
  [lang='bn'] h2,
  [lang='fa'] h2,
  [lang='he'] h2,
  [lang='hi'] h2,
  [lang='gu'] h2,
  [lang='jpn'] h2,
  [lang='ko'] h2,
  [lang='lzh'] h2,
  [lang='mr'] h2,
  [lang='si'] h2,
  [lang='ta'] h2,
  [lang='th'] h2,
  [lang='xct'] h2,
  [lang='zh'] h2 {
    font-weight: bold;
  }

  [lang='my'] * {
    line-height: 2;
  }

  [lang='ar'] {
    font-family: var(--sc-arabic-serif-font);
  }
  [lang='bn'] {
    font-family: var(--sc-bengali-serif-font);
  }
  [lang='fa'] {
    font-family: var(--sc-arabic-serif-font);
  }
  [lang='he'] {
    font-family: var(--sc-hebrew-serif-font);
  }
  [lang='hi'] {
    font-family: var(--sc-devanagari-serif-font);
  }
  [lang='gu'] {
    font-family: var(--sc-gujarati-serif-font);
  }
  [lang='jpn'] {
    font-family: var(--sc-japanese-font);
  }
  [lang='ko'] {
    font-family: var(--sc-korean-font);
  }
  [lang='lzh'] {
    font-family: var(--sc-traditional-chinese-font);
  }
  [lang='mr'] {
    font-family: var(--sc-devanagari-serif-font);
  }
  [lang='my'] {
    font-family: var(--sc-myanmar-serif-font);
  }
  [lang='si'] {
    font-family: var(--sc-sinhala-serif-font);
  }
  [lang='ta'] {
    font-family: var(--sc-tamil-serif-font);
  }
  [lang='th'] {
    font-family: var(--sc-thai-serif-font);
  }
  [lang='xct'] {
    font-family: var(--sc-tibetan-font);
  }
  [lang='zh'] {
    font-family: var(--sc-traditional-chinese-font);
  }

  /* don't let Pali/sanskrit words go too long, probably won't work but oh well */

  [lang='pli'],
  [lang='san'] {
    word-wrap: break-word;

    overflow-wrap: break-word;
  }

  [lang='ko'] * {
    font-synthesis: none;
  }

      <!---->

            .container {
              padding-top: 64px;
              padding-bottom: 64px;
            }

            .link-anchor {
              position: absolute;
              width: calc(100% + 20px);
              height: 100%;
            }

            sc-page-selector {
              display: block;
              box-sizing: border-box;
              min-height: 100vh;
              height: 100%;
            }
          
.inline-style-1 {height: 60px;}
.inline-style-2 {display: block;}
.inline-style-3 {--scrollbar-width: 15px; --sc-primary-color: #c68b05; --sc-primary-color-light: #f9b20f; --sc-primary-color-light-transparent: rgba(252, 239, 149, 0.2); --sc-primary-color-dark: #9e6f04; --sc-primary-accent-color: #5aa8f2; --sc-primary-accent-color-light: #4886C1; --sc-secondary-accent-color: #C03030; --sc-secondary-accent-color-light: #CC5959; --sc-primary-background-color: #414141; --sc-on-primary-primary-text-color: #eeeeee; --sc-on-primary-secondary-text-color: #cccccc; --sc-secondary-background-color: #515151; --sc-on-secondary-primary-text-color: #efefef; --sc-on-secondary-secondary-text-color: #cdcdcd; --sc-tertiary-background-color: #616161; --sc-on-tertiary-primary-text-color: #ffffff; --sc-on-tertiary-secondary-text-color: #dddddd; --sc-dark-fixed-background-color: #515151; --sc-darker-fixed-background-color: #414141; --sc-inverted-text-color: #ffffff; --sc-opposite-background-color: #ffffff; --sc-opposite-text-color: #201b13; --sc-icon-color: #ababab; --sc-border-color: #777; --sc-toast-error-color: #ba1a1a; --sc-toast-success-color: var(--sc-primary-accent-color-light); --sc-pie-chart-bg-color: var(--sc-primary-accent-color-light); --sc-pie-chart-fill-color: var(--sc-primary-accent-color);}
.inline-style-4 {position: sticky; transform: none; box-shadow: none;}
.inline-style-5 {transform: scale(1);}
.inline-style-6 {display: none; opacity: 1; transform: scale(1); height: 1em;}
.inline-style-7 {display: flex;}
.inline-style-8 {transform: none;}
.inline-style-9 {display: none;}
</style>`;

export { commentWrapper, cssStyles, searchStyle };
