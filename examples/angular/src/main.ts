import { bootstrapApplication } from '@angular/platform-browser';
import { defineCareOSElements } from 'health-components/elements';
import { AppComponent } from './app/app.component';

// Registers every <co-*> custom element and injects the CareOS token stylesheet.
defineCareOSElements();

bootstrapApplication(AppComponent).catch((err) => console.error(err));
