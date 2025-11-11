declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.css' {
    const content: string;
    export default content;
}

// Specifically for CSS imports
declare module '../dist/styles/components.css';
declare module '../src/styles/components.css';