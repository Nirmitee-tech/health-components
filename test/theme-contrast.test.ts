import { describe, expect, it } from 'vitest';
import tokens from '../src/tokens/tokens.json';
function luminance(hex: string) {
  const channels = hex.replace('#', '').match(/../g)!.map(channel => parseInt(channel,16)/255).map(value => value <= .04045 ? value/12.92 : ((value+.055)/1.055)**2.4);
  return channels[0]!*.2126 + channels[1]!*.7152 + channels[2]!*.0722;
}
function value(name: string, theme: string) {
  const token = tokens.color.tokens.find(token => token.name === name)!;
  return typeof token.value === 'string' ? token.value : (token.value as Record<string,string>)[theme]!;
}
describe('theme text contrast', () => {
  for (const {id} of tokens.color.themes) {
    it(`${id}: input boundaries remain visible on the surface`, () => {
      const a=luminance(value('border-strong',id)), b=luminance(value('surface',id));
      expect((Math.max(a,b)+.05)/(Math.min(a,b)+.05)).toBeGreaterThanOrEqual(3);
    });
    for (const [foreground, background] of [['ink','surface'],['muted','surface'],['muted','canvas'],['primary-ink','primary'],['danger-ink','danger-soft']]) {
      it(`${id}: ${foreground} is readable on ${background}`, () => {
        const a=luminance(value(foreground!,id)), b=luminance(value(background!,id));
        expect((Math.max(a,b)+.05)/(Math.min(a,b)+.05)).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
});
