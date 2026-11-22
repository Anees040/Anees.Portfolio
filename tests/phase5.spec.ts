import { expect, test, type Page } from "@playwright/test";
import { ParticleEngine } from "../lib/particle-engine";
import { credentials, profileContent, skillGroups } from "../lib/profile-content";
import { caseStudies } from "../lib/case-studies";
import AxeBuilder from "@axe-core/playwright";

test.use({ screenshot: "off", video: "off", trace: "off" });
const viewports = [[320,568],[360,640],[375,812],[390,844],[414,896],[430,932],[768,1024],[820,1180],[1024,768],[1280,720],[1440,900],[1920,1080],[2560,1440],[844,390],[1440,600]];
async function load(page: Page) {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

for (const [width,height] of viewports) test(`corrected wordmarks and Contact fit ${width} × ${height}, including doubled text`, async ({ page }) => {
  await page.setViewportSize({width,height}); await page.emulateMedia({reducedMotion:"reduce"}); await load(page);
  for (const enlarged of [false,true]) {
    if (enlarged) { await page.evaluate(() => { document.documentElement.style.fontSize="200%"; }); await page.waitForTimeout(100); }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+1);
    for(const selector of ['#skills','#education','#certificates','[data-professional-project]']) {
      for(const element of await page.locator(selector).all()) { const box=(await element.boundingBox())!; expect(box.x).toBeGreaterThanOrEqual(-1); expect(box.x+box.width).toBeLessThanOrEqual(width+1); }
    }
    const wordmarks = await page.locator('[data-travel-title], [data-thread-title]').evaluateAll(elements=>elements.map(word=> {
      const box=word.getBoundingClientRect(),safe=word.parentElement!.getBoundingClientRect();
      return {title:word.textContent,left:box.left,right:box.right,safeLeft:safe.left,safeRight:safe.right,hidden:word.closest('[aria-hidden="true"]')!==null};
    }));
    expect(wordmarks.length).toBe(11);
    for (const word of wordmarks) { expect(word.hidden).toBe(true); expect(word.left,word.title!).toBeGreaterThanOrEqual(word.safeLeft-1); expect(word.right,word.title!).toBeLessThanOrEqual(word.safeRight+1); }
    await page.evaluate(() => { document.getElementById('contact')!.scrollIntoView({block:'start'}); }); await page.waitForTimeout(100);
    const heading=(await page.locator('#contact-heading').boundingBox())!, header=(await page.locator('.site-header').boundingBox())!;
    expect(heading.y).toBeGreaterThanOrEqual(header.height); expect(heading.x+heading.width).toBeLessThanOrEqual(width+1);
    if (!enlarged || height>=768) expect(heading.y+heading.height).toBeLessThanOrEqual(height+1);
    await expect(page.locator('#contact').getByRole('link',{name:'Write to Anees'})).toHaveAttribute('href','mailto:muhammadanees0511@gmail.com');
  }
});

test('wordmark entrance reverses and holds a complete measured composition for reading', async ({page})=>{
  await page.setViewportSize({width:1440,height:900}); await load(page);
  const scene=page.locator('[data-scroll-scene="title-engineering"]'), word=scene.locator('[data-travel-title]');
  const top=await scene.evaluate(element=>element.getBoundingClientRect().top+scrollY);
  const x=()=>word.evaluate(element=>new DOMMatrix(getComputedStyle(element).transform).m41);
  await page.evaluate(top=>scrollTo(0,top-850),top); await page.waitForTimeout(100); const start=await x();
  await page.evaluate(top=>scrollTo(0,top-150),top); await page.waitForTimeout(100); const rest=await x();
  await page.evaluate(top=>scrollTo(0,top+250),top); await page.waitForTimeout(100); expect(await x()).toBeCloseTo(rest,0);
  await page.evaluate(top=>scrollTo(0,top-850),top); await page.waitForTimeout(100); expect(await x()).toBeCloseTo(start,0); expect(start).toBeGreaterThan(rest+50);
  await page.emulateMedia({reducedMotion:'reduce'}); expect(await word.evaluate(element=>element.getBoundingClientRect().left>=element.parentElement!.getBoundingClientRect().left-1)).toBe(true);
});

test('wordmark fitting follows a font swap and a live text-size change',async({page})=>{
  await page.setViewportSize({width:1440,height:900}); await page.emulateMedia({reducedMotion:'reduce'}); await load(page);
  const word=page.locator('[data-scroll-scene="title-engineering"] [data-travel-title]');
  await word.evaluate(element=>{element.style.fontFamily='Georgia, serif';});
  await expect.poll(()=>word.evaluate(element=>element.getBoundingClientRect().width<=element.parentElement!.clientWidth+1)).toBe(true);
  await page.evaluate(()=>{document.documentElement.style.fontSize='200%';});
  await expect.poll(()=>word.evaluate(element=>element.getBoundingClientRect().right<=element.parentElement!.getBoundingClientRect().right+1)).toBe(true);
});

for (const mode of ['main','worker'] as const) test(`portrait ${mode}: wide central response, held field, exact return and replay`,async({page})=>{
  const errors:string[]=[]; page.on('pageerror',error=>errors.push(error.message));
  await page.setViewportSize({width:1440,height:900});
  if(mode==='main') await page.addInitScript(()=>{Object.defineProperty(window,'Worker',{value:undefined});});
  await load(page); const portrait=page.locator('.image-atomizer');
  await expect(portrait).toHaveAttribute('data-particle-formation-complete','true');
  const box=(await portrait.locator('img').boundingBox())!;
  await page.mouse.move(box.x+box.width*.5,box.y+box.height*.48,{steps:20});
  await expect.poll(async()=>JSON.parse((await portrait.getAttribute('data-particle-metrics'))!).maxDisplacement).toBeGreaterThan(box.width*.09);
  await expect(portrait).toHaveAttribute('data-particle-phase','holding',{timeout:10000});
  const metrics=JSON.parse((await portrait.getAttribute('data-particle-metrics'))!);
  expect(metrics.mode).toBe(mode); expect(metrics.interactionRadius/metrics.portraitWidth).toBeCloseTo(.44); expect(metrics.particles).toBeLessThanOrEqual(32000); expect(metrics.bufferBytes).toBeLessThanOrEqual(8*1024*1024);
  expect(metrics.affectedParticles).toBeGreaterThan(metrics.particles*.35); expect((metrics.updateMs+metrics.drawMs)/metrics.frames).toBeLessThanOrEqual(12);
  await page.waitForTimeout(250); expect(await portrait.getAttribute('data-particle-metrics')).toBe(JSON.stringify(metrics));
  await page.mouse.move(20,120); await expect(portrait).toHaveAttribute('data-particle-reassembled','true');
  expect(JSON.parse((await portrait.getAttribute('data-particle-metrics'))!).maxDisplacement).toBe(0);
  await portrait.getByRole('button',{name:'Reassemble portrait'}).focus(); await page.keyboard.press('Enter'); await expect(portrait).toHaveAttribute('data-particle-formation-count','2'); await expect(portrait).toHaveAttribute('data-particle-reassembled','true');
  await page.mouse.move(box.x+box.width*.5,box.y+box.height*.5); await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForTimeout(100);
  await expect(portrait.locator('img')).toHaveCSS('opacity','1'); await expect(page.locator('.particle-canvas')).toHaveCount(0);
  await page.emulateMedia({reducedMotion:'no-preference'}); await expect(portrait).toHaveAttribute('data-particle-first-frame','true');
  await page.mouse.move(box.x+box.width*.5,box.y+box.height*.5); await expect(portrait).toHaveAttribute('data-particle-phase','holding');
  await page.emulateMedia({reducedMotion:'reduce'}); await expect(page.locator('.particle-canvas')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('professional profile uses approved roles, education, project-backed skills and a compact credentials empty state',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'}); await load(page);
  await expect(page.locator('#about')).toContainText(profileContent.practice);
  await expect(page.locator('#education')).toContainText('Studying Software Engineering'); await expect(page.locator('#education')).toContainText('COMSATS University Islamabad');
  await expect(page.locator('#education')).not.toContainText(/CGPA|graduated|award/i);
  for(const group of skillGroups) { await expect(page.locator('#skills')).toContainText(group.name); for(const slug of group.projects) await expect(page.locator(`#skills a[href="/work/${slug}"]`).first()).toBeAttached(); }
  for(const study of caseStudies) await expect(page.locator(`[data-professional-project="${study.slug}"]`)).toContainText(study.role);
  await expect(page.locator('[data-professional-project="sportlynk"]')).toContainText('Not launched');
  expect(credentials).toEqual([]); await expect(page.locator('#certificates')).toContainText('Verified certificates and credentials will appear here as I add them.');
  expect(await page.locator('#certificates').evaluate(element=>element.getBoundingClientRect().height)).toBeLessThan(200);
  await expect(page.locator('#certificates img, #certificates li, a[download]')).toHaveCount(0);
  await expect(page.locator('#evidence a[href="https://github.com/Anees040/FitPilot"]')).toHaveCount(1);
  await expect(page.locator('#evidence a[href="https://github.com/Anees040/sukoon"]')).toHaveCount(1);
  await expect(page.locator('#evidence a[href="https://github.com/Anees040/EduVerse"]')).toHaveCount(1);
});

test('professional sections retain accessible names, structure and contrast',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'}); await load(page);
  const result=await new AxeBuilder({page}).include('#about').include('#skills').include('#evidence').analyze();
  expect(result.violations).toEqual([]);
});

test('skills and credentials anchors preserve keyboard focus and Contact actions',async({page,context})=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']); await page.emulateMedia({reducedMotion:'reduce'}); await load(page);
  const skills=page.locator('#about a[href="#skills"]'); await skills.focus(); await skills.press('Enter'); await expect(page.locator('#skills')).toBeFocused();
  await page.goto('/#certificates'); await expect(page.locator('#certificates')).toBeVisible();
  await page.locator('#contact').scrollIntoViewIfNeeded(); const copy=page.getByRole('button',{name:'Copy email',exact:true}); await copy.focus(); await copy.press('Enter');
  await expect(page.locator('#email-copy-status')).toContainText(/copied/i); expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('muhammadanees0511@gmail.com');
});

test('without JavaScript the profile, skills, project evidence, certificates and original portrait remain available',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}); const page=await context.newPage();
  await page.goto('http://127.0.0.1:3100/#certificates',{waitUntil:'networkidle'});
  await expect(page.locator('#certificates')).toContainText('Verified certificates and credentials will appear here as I add them.');
  await expect(page.locator('#skills')).toContainText('Firebase Realtime Database'); await expect(page.locator('#education')).toContainText('COMSATS University Islamabad');
  await expect(page.locator('[data-professional-project]')).toHaveCount(4); await expect(page.locator('.character-portrait')).toHaveAttribute('alt','Photograph of Muhammad Anees.');
  await expect(page.locator('.particle-canvas')).toHaveCount(0); await context.close();
});

test('a sample exactly at the pointer repels, stays bounded, and reassembles byte for byte at 30 and 60 Hz',()=>{
  const pixels=new Uint8ClampedArray(64*64*4); pixels.set([168,93,63,255],(32*64+32)*4);
  const results=[];
  for(const hz of [30,60]) {
    let rendered:Uint8ClampedArray|undefined;
    const context={createImageData:(width:number,height:number)=>({width,height,data:new Uint8ClampedArray(width*height*4)}),putImageData:(image:ImageData)=>{rendered=image.data.slice();}} as unknown as CanvasRenderingContext2D;
    const engine=new ParticleEngine(context,{width:64,height:64,pixels,gap:1,portraitWidth:64});
    engine.pointer(32,32); for(let step=0;step<hz;step++) engine.step(1000/hz);
    expect(engine.metrics.maxDisplacement).toBeGreaterThan(3); expect(engine.metrics.maxDisplacement).toBeLessThanOrEqual(64*.24+.01); results.push(engine.metrics.maxDisplacement);
    engine.pointer(-1000,-1000); for(let step=0;step<hz*2;step++) { if(engine.step(1000/hz)) break; }
    expect(engine.metrics.reassembled).toBe(true); expect(rendered).toEqual(pixels);
  }
  expect(Math.abs(results[0]-results[1])).toBeLessThan(.5);
});
