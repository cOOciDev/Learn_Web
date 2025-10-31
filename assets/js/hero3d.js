// assets/js/hero3d.js
// Lightweight 3D hero with particles fallback + theme sync + viewport lazy init

const MAX_DPR = 2;
const MOBILE_MAX_WIDTH = 414;

const state = {
  disposed: false,
  isLite: false,
  raf: 0,
  mouse: { x: 0, y: 0, tx: 0, ty: 0 }
};

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);
const currentTheme = () => document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

function watchTheme(cb) {
  const mo = new MutationObserver(() => cb(currentTheme()));
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return mo;
}

const computeLiteMode = () => {
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const deviceMemory = navigator.deviceMemory || 2;
  const isSmallMobile = Math.min(window.innerWidth, window.innerHeight) <= MOBILE_MAX_WIDTH;
  return prefersReducedMotion || deviceMemory <= 2 || isSmallMobile;
};

/* -------------------- Particles fallback (2D) -------------------- */
function initParticles(canvas) {
  state.isLite = true;
  const ctx = canvas.getContext('2d');
  let W, H, DPR;

  const N = Math.round(clamp((window.innerWidth * window.innerHeight) / 12000, 24, 90));
  const particles = Array.from({ length: N }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0006,
    vy: (Math.random() - 0.5) * 0.0006,
    r: Math.random() * 1.1 + 0.4
  }));

  function size() {
    DPR = clamp(window.devicePixelRatio || 1, 1, MAX_DPR);
    const rect = canvas.parentElement?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight * .5 };
    W = Math.max(320, rect.width);
    H = Math.max(160, rect.height);
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  const colors = () => currentTheme() === 'light'
    ? { dot: 'rgba(30,41,59,.75)', link: 'rgba(14,165,233,.35)' }
    : { dot: 'rgba(255,255,255,.75)', link: 'rgba(56,189,248,.28)' };

  function tick() {
    if (state.disposed) return;
    const c = colors();
    ctx.clearRect(0, 0, W, H);

    state.mouse.tx = lerp(state.mouse.tx, state.mouse.x, 0.08);
    state.mouse.ty = lerp(state.mouse.ty, state.mouse.y, 0.08);
    const ox = state.mouse.tx * 6;
    const oy = state.mouse.ty * 6;

    particles.forEach(p => {
      p.x += p.vx + state.mouse.x * 0.0005;
      p.y += p.vy + state.mouse.y * 0.0005;
      if (p.x < -0.05) p.x = 1.05;
      if (p.x > 1.05) p.x = -0.05;
      if (p.y < -0.05) p.y = 1.05;
      if (p.y > 1.05) p.y = -0.05;
    });

    ctx.lineWidth = 1;
    ctx.strokeStyle = c.link;
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = (particles[i].x - particles[j].x) * W;
        const dy = (particles[i].y - particles[j].y) * H;
        const d2 = dx * dx + dy * dy;
        if (d2 < 120 * 120) {
          ctx.globalAlpha = 1 - d2 / (120 * 120);
          ctx.beginPath();
          ctx.moveTo(particles[i].x * W + ox, particles[i].y * H + oy);
          ctx.lineTo(particles[j].x * W + ox, particles[j].y * H + oy);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = c.dot;
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x * W + ox, p.y * H + oy, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    state.raf = requestAnimationFrame(tick);
  }

  function onPointer(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (('touches' in e) ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (('touches' in e) ? e.touches[0].clientY : e.clientY) - rect.top;
    state.mouse.x = clamp((x / rect.width) * 2 - 1, -1, 1);
    state.mouse.y = clamp((y / rect.height) * 2 - 1, -1, 1);
  }

  size();
  tick();
  on(window, 'resize', size, { passive: true });
  on(canvas, 'pointermove', onPointer, { passive: true });
  on(canvas, 'touchmove', onPointer, { passive: true });

  const mo = watchTheme(() => {});
  return () => { mo.disconnect(); cancelAnimationFrame(state.raf); };
}

/* -------------------- Three.js scene -------------------- */
async function initThree(canvas, modelHref) {
  state.isLite = false;
  const module = await import('./three-cdn.js');
  const {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    sRGBEncoding,
    ACESFilmicToneMapping,
    Color,
    Group,
    HemisphereLight,
    DirectionalLight,
    FogExp2,
    BoxGeometry,
    MeshStandardMaterial,
    Mesh,
    Clock,
    PointLight,
    PMREMGenerator,
    CircleGeometry
  } = module.THREE;
  const { OrbitControls, GLTFLoader, RoomEnvironment } = module;

  const rect = canvas.getBoundingClientRect();
  const scene = new Scene();
  scene.fog = new FogExp2(currentTheme() === 'light' ? 0xffffff : 0x050113, 1.9);

  const camera = new PerspectiveCamera(28, rect.width / rect.height, 0.1, 20);
  camera.position.set(0.2, 0.2, 3.5);

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.outputEncoding = sRGBEncoding;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
  renderer.setSize(rect.width, rect.height, false);

  const pmrem = new PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const hemi = new HemisphereLight(0xffffff, 0x0d0b21, 0.85);
  scene.add(hemi);

  const keyLight = new DirectionalLight(0xb7a4ff, 1.45);
  keyLight.position.set(2.4, 3.6, 3.2);
  scene.add(keyLight);

  const rim = new DirectionalLight(0x02e1ff, 0.95);
  rim.position.set(-3.6, 2.4, -2.8);
  scene.add(rim);

  const accent = new PointLight(0xff71d3, 1.2, 8, 2.2);
  accent.position.set(0.4, 1.6, 2.4);
  scene.add(accent);

  const ground = new Mesh(
    new CircleGeometry(2.2, 90),
    new MeshStandardMaterial({
      color: new Color('#281843'),
      metalness: 0.2,
      roughness: 0.8,
      transparent: true,
      opacity: 0.85
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.52;
  ground.receiveShadow = false;
  scene.add(ground);

  const halo = new Mesh(
    new CircleGeometry(1.2, 64),
    new MeshStandardMaterial({
      color: new Color('#6c5bff'),
      emissive: new Color('#6c5bff'),
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.25
    })
  );
  halo.rotation.x = -Math.PI / 2;
  halo.position.y = -0.48;
  scene.add(halo);

  const applyTheme = (mode) => {
    const primary = mode === 'light' ? '#faf9ff' : '#141022';
    const back = mode === 'light' ? '#ebe9ff' : '#050113';
    scene.background = new Color(back);
    hemi.color = new Color(primary);
    scene.fog.color = new Color(back);
  };
  applyTheme(currentTheme());
  const themeObs = watchTheme(applyTheme);

  const root = new Group();
  scene.add(root);

  const loader = new GLTFLoader();
  try {
    const gltf = modelHref ? await loader.loadAsync(modelHref) : null;
    const model = gltf?.scene || gltf?.scenes?.[0];
    if (model) {
      model.traverse((o) => {
        if (o.isMesh) {
          o.castShadow = false;
          o.receiveShadow = false;
          if (o.material) {
            o.material.envMapIntensity = 1.3;
            o.material.metalness = Math.min(0.8, (o.material.metalness ?? 0.3) + 0.2);
            o.material.roughness = Math.max(0.1, (o.material.roughness ?? 0.6) - 0.25);
          }
        }
      });
      model.scale.setScalar(1.3);
      model.position.set(0, -0.42, 0);
      model.rotation.y = Math.PI * 0.15;
      root.add(model);
    } else {
      throw new Error('No GLTF scene');
    }
  } catch {
    const geo = new BoxGeometry(0.9, 0.9, 0.9, 1, 1, 1);
    const mat = new MeshStandardMaterial({ color: new Color('#8b5cf6'), metalness: 0.2, roughness: 0.35 });
    const mesh = new Mesh(geo, mat);
    mesh.rotation.set(0.3, 0.5, 0.1);
    root.add(mesh);
  }

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableRotate = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;

  const target = { rx: 0, ry: 0 };
  function onPointer(e) {
    const r = renderer.domElement.getBoundingClientRect();
    const px = (('touches' in e) ? e.touches[0].clientX : e.clientX) - r.left;
    const py = (('touches' in e) ? e.touches[0].clientY : e.clientY) - r.top;
    const nx = clamp(px / r.width, 0, 1) * 2 - 1;
    const ny = clamp(py / r.height, 0, 1) * 2 - 1;
    state.mouse.x = nx;
    state.mouse.y = ny;
  }
  on(renderer.domElement, 'pointermove', onPointer, { passive: true });
  on(renderer.domElement, 'touchmove', onPointer, { passive: true });

  const clock = new Clock();
  function render() {
    if (state.disposed) return;
    const t = clock.getElapsedTime();

    root.position.y = Math.sin(t * 0.8) * 0.03;
    root.rotation.y += 0.0008;

    const aimRX = state.mouse.y * 0.15;
    const aimRY = state.mouse.x * 0.35;
    target.rx = lerp(target.rx, aimRX, 0.08);
    target.ry = lerp(target.ry, aimRY, 0.08);

    root.rotation.x = target.rx;
    root.rotation.y += (target.ry - root.rotation.y) * 0.08;

    camera.position.z = lerp(camera.position.z, 2.35 + Math.abs(target.ry) * 0.15, 0.05);

    controls.update();
    renderer.render(scene, camera);
    state.raf = requestAnimationFrame(render);
  }

  function dispose() {
    state.disposed = true;
    cancelAnimationFrame(state.raf);
    themeObs.disconnect();
    renderer.dispose();
  }

  const size = () => {
    const r = canvas.getBoundingClientRect();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  };
  size();

  on(window, 'resize', size, { passive: true });
  on(document, 'visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(state.raf);
    else state.raf = requestAnimationFrame(render);
  });

  render();
  pmrem.dispose();
  return dispose;
}

/* -------------------- Public API (called from main.js) -------------------- */
export function initHero3D(canvas, { model = '../models/mascot.glb' } = {}) {
  if (!canvas) return () => {};
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';

  const modelHref = model ? new URL(model, import.meta.url).href : null;

  state.disposed = false;
  state.raf = 0;
  Object.assign(state.mouse, { x: 0, y: 0, tx: 0, ty: 0 });

  let cleanup = null;

  const mount = async () => {
    const liteMode = computeLiteMode();
    try {
      if (liteMode) {
        cleanup = initParticles(canvas);
      } else {
        cleanup = await initThree(canvas, modelHref);
      }
    } catch (e) {
      console.warn('[hero3d] falling back to particles:', e);
      cleanup = initParticles(canvas);
    }
  };

  const io = new IntersectionObserver((entries) => {
    const v = entries.some(e => e.isIntersecting);
    if (v) {
      io.disconnect();
      mount();
    }
  }, { rootMargin: '120px' });
  io.observe(canvas);

  return () => { io.disconnect(); cleanup && cleanup(); state.disposed = true; };
}
