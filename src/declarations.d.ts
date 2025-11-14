declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.css' {
    const content: string;
    export default content;
}

// SVG module declarations
declare module '*.svg' {
    const content: string;
    export default content;
}

declare module '*.svg?react' {
    import * as React from 'react';
    const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    export default ReactComponent;
}

// Specifically for CSS imports
declare module '../dist/styles/components.css';
declare module '../src/styles/components.css';