import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function Scene() {
  const containerRef = useRef(null)
  const [mode, setMode] = useState('shaded') // 'shaded' | 'blueprint' | 'video'
  const isCinematic = false
  const [customVideoUrl, setCustomVideoUrl] = useState('')
  const [videoError, setVideoError] = useState(false)
  // Store mode in a ref for the animation loop
  const modeRef = useRef(mode)
  modeRef.current = mode
  const isCinematicRef = useRef(isCinematic)
  isCinematicRef.current = isCinematic

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: window.innerWidth >= 768,
        alpha: true,
        powerPreference: 'high-performance',
      })
    } catch (e) {
      console.warn('WebGL initialization failed:', e)
      return
    }

    const isMobile = window.innerWidth < 768
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.shadowMap.enabled = !isMobile
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    el.appendChild(renderer.domElement)

    // Scene & Fog (High-Precision Cleanroom Studio)
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0xf8fafc, 0.018)

    // Camera
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 120)
    camera.position.set(0, 2.4, 11)

    // Master Materials Library (Clean White + Emerald Green Architecture)
    const mats = {
      // High-precision automotive materials
      orangePaint: new THREE.MeshStandardMaterial({
        color: 0x059669, // Precision Industrial Emerald
        roughness: 0.32,
        metalness: 0.65,
      }),
      darkTitanium: new THREE.MeshStandardMaterial({
        color: 0x334155, // Clean Precision Slate
        roughness: 0.42,
        metalness: 0.85,
      }),
      chrome: new THREE.MeshStandardMaterial({
        color: 0xf1f5f9, // Polished Mirror Chrome
        roughness: 0.12,
        metalness: 0.98,
      }),
      copper: new THREE.MeshStandardMaterial({
        color: 0x10b981, // Vibrant Emerald Contact
        roughness: 0.3,
        metalness: 0.9,
      }),
      carBody: new THREE.MeshStandardMaterial({
        color: 0xe2e8f0, // Body-in-White Brushed Aluminum
        roughness: 0.25,
        metalness: 0.85,
      }),
      conveyorSteel: new THREE.MeshStandardMaterial({
        color: 0x64748b, // High-tensile stainless steel
        roughness: 0.45,
        metalness: 0.8,
      }),
      hazardStripe: new THREE.MeshStandardMaterial({
        color: 0x10b981, // Safety Emerald
        roughness: 0.4,
        metalness: 0.3,
      }),
      floor: new THREE.MeshStandardMaterial({
        color: 0xf8fafc, // Pristine White Cleanroom Floor
        roughness: 0.28,
        metalness: 0.15,
      }),
      gantryBeam: new THREE.MeshStandardMaterial({
        color: 0x94a3b8, // Clean High-bay Structural Gantry
        roughness: 0.5,
        metalness: 0.75,
      }),
      pipeSilver: new THREE.MeshStandardMaterial({
        color: 0xcbd5e1, // Utility stainless piping
        roughness: 0.2,
        metalness: 0.9,
      }),
      pipeYellow: new THREE.MeshStandardMaterial({
        color: 0x047857, // Industrial Process Emerald
        roughness: 0.35,
        metalness: 0.65,
      }),

      // Blueprint / Wireframe Materials (Emerald Green Grid System)
      bpCyan: new THREE.LineBasicMaterial({ color: 0x059669, transparent: true, opacity: 0.85 }),
      bpOrange: new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.9 }),
      bpPale: new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.4 }),
    }

    // Helper functions for geometric components
    const solidMeshes = []
    const wireframeLines = []

    function createSolidMesh(geom, mat, castShadow = true) {
      const mesh = new THREE.Mesh(geom, mat)
      mesh.castShadow = castShadow && !isMobile
      mesh.receiveShadow = !isMobile
      solidMeshes.push(mesh)

      // Also create wireframe edges for Blueprint mode
      const edges = new THREE.EdgesGeometry(geom, 25)
      const wire = new THREE.LineSegments(
        edges,
        mat === mats.orangePaint || mat === mats.copper ? mats.bpOrange : mats.bpCyan
      )
      wire.visible = false
      mesh.add(wire)
      wireframeLines.push(wire)

      return mesh
    }

    // --- 1. LIGHTING (High-End Daylight Studio) ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.8)
    mainLight.position.set(12, 18, 14)
    if (!isMobile) {
      mainLight.castShadow = true
      mainLight.shadow.mapSize.width = 1024
      mainLight.shadow.mapSize.height = 1024
      mainLight.shadow.camera.near = 1
      mainLight.shadow.camera.far = 40
      mainLight.shadow.camera.left = -15
      mainLight.shadow.camera.right = 15
      mainLight.shadow.camera.top = 15
      mainLight.shadow.camera.bottom = -15
    }
    scene.add(mainLight)

    const rimLight = new THREE.DirectionalLight(0x10b981, 1.4)
    rimLight.position.set(-14, 10, -12)
    scene.add(rimLight)

    // Dynamic Welding Arc Light
    const arcLight = new THREE.PointLight(0xdcfce7, 0, 16)
    scene.add(arcLight)

    // Secondary laser inspection light (Precision Emerald)
    const laserSpot = new THREE.SpotLight(0x10b981, 2.2, 18, Math.PI / 9, 0.4, 1.2)
    laserSpot.position.set(-5, 5, -5)
    scene.add(laserSpot)
    const laserTarget = new THREE.Object3D()
    scene.add(laserTarget)
    laserSpot.target = laserTarget

    // --- 2. FACTORY FLOOR & GRID ---
    const floorGeo = new THREE.PlaneGeometry(120, 120)
    const floorMesh = new THREE.Mesh(floorGeo, mats.floor)
    floorMesh.rotation.x = -Math.PI / 2
    floorMesh.position.y = -2.01
    floorMesh.receiveShadow = !isMobile
    scene.add(floorMesh)

    const gridHelper = new THREE.GridHelper(90, 60, 0x10b981, 0xe2e8f0)
    gridHelper.position.y = -2.0
    scene.add(gridHelper)

    // --- 3. CONVEYOR SYSTEM ---
    const conveyorGroup = new THREE.Group()
    scene.add(conveyorGroup)

    // Conveyor Dual Guide Rails
    for (const z of [-4.2, -6.6]) {
      const railGeo = new THREE.BoxGeometry(64, 0.22, 0.28)
      const rail = createSolidMesh(railGeo, mats.conveyorSteel)
      rail.position.set(0, -1.82, z)
      conveyorGroup.add(rail)

      // Hazard Yellow Trim
      const trimGeo = new THREE.BoxGeometry(64, 0.06, 0.08)
      const trim = createSolidMesh(trimGeo, mats.hazardStripe, false)
      trim.position.set(0, -1.68, z)
      conveyorGroup.add(trim)
    }

    // Cross Support Beams & Legs
    const rollers = []
    for (let x = -30; x <= 30; x += 3.2) {
      // Floor Stand Leg
      const legGeo = new THREE.BoxGeometry(0.24, 0.8, 2.7)
      const leg = createSolidMesh(legGeo, mats.conveyorSteel)
      leg.position.set(x, -2.0 + 0.4, -5.4)
      conveyorGroup.add(leg)

      // Conveyor Rollers
      for (let rz = -6.2; rz <= -4.6; rz += 0.8) {
        const rollerGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 12)
        const roller = createSolidMesh(rollerGeo, mats.chrome, false)
        roller.rotation.x = Math.PI / 2
        roller.position.set(x + 1.6, -1.74, rz)
        conveyorGroup.add(roller)
        rollers.push(roller)
      }
    }

    // --- 4. CAR CHASSIS / BODY-IN-WHITE (BIW) ---
    function buildCarChassis() {
      const car = new THREE.Group()

      // Lower Skid Frame / Carrier Platform
      const skidGeo = new THREE.BoxGeometry(5.2, 0.16, 2.2)
      const skid = createSolidMesh(skidGeo, mats.darkTitanium)
      skid.position.y = 0.08
      car.add(skid)

      // Main Floor Pan
      const floorPanGeo = new THREE.BoxGeometry(4.6, 0.18, 1.95)
      const floorPan = createSolidMesh(floorPanGeo, mats.carBody)
      floorPan.position.y = 0.24
      car.add(floorPan)

      // Front Engine Bay / Bulkhead
      const hoodGeo = new THREE.BoxGeometry(1.4, 0.55, 1.8)
      const hood = createSolidMesh(hoodGeo, mats.carBody)
      hood.position.set(-1.45, 0.55, 0)
      car.add(hood)

      // Rear Trunk / Quarter Panel Section
      const trunkGeo = new THREE.BoxGeometry(1.2, 0.65, 1.8)
      const trunk = createSolidMesh(trunkGeo, mats.carBody)
      trunk.position.set(1.5, 0.6, 0)
      car.add(trunk)

      // Passenger Cabin Pillars (A, B, C Pillars)
      // A-Pillars (Front Windshield Slanted Rails)
      for (const side of [-0.85, 0.85]) {
        const aPillarGeo = new THREE.BoxGeometry(0.14, 0.9, 0.14)
        const aPillar = createSolidMesh(aPillarGeo, mats.carBody)
        aPillar.rotation.z = -0.38
        aPillar.position.set(-0.6, 1.0, side)
        car.add(aPillar)

        // B-Pillar (Center Vertical Pillar)
        const bPillarGeo = new THREE.BoxGeometry(0.14, 0.82, 0.14)
        const bPillar = createSolidMesh(bPillarGeo, mats.carBody)
        bPillar.position.set(0.15, 0.95, side)
        car.add(bPillar)

        // C-Pillar (Rear Slanted Pillar)
        const cPillarGeo = new THREE.BoxGeometry(0.14, 0.85, 0.14)
        const cPillar = createSolidMesh(cPillarGeo, mats.carBody)
        cPillar.rotation.z = 0.35
        cPillar.position.set(0.85, 0.98, side)
        car.add(cPillar)

        // Lower Door Sill
        const sillGeo = new THREE.BoxGeometry(1.8, 0.25, 0.12)
        const sill = createSolidMesh(sillGeo, mats.carBody)
        sill.position.set(0.15, 0.35, side)
        car.add(sill)
      }

      // Roof Frame
      const roofGeo = new THREE.BoxGeometry(1.65, 0.08, 1.7)
      const roof = createSolidMesh(roofGeo, mats.carBody)
      roof.position.set(0.1, 1.38, 0)
      car.add(roof)

      return car
    }

    const cars = []
    const carSpacing = 11.5
    for (let i = 0; i < 5; i++) {
      const car = buildCarChassis()
      car.position.set(-20 + i * carSpacing, -1.68, -5.4)
      scene.add(car)
      cars.push(car)
    }

    // --- 5. MAIN ARTICULATED ROBOT (6-AXIS SPOT WELDER) ---
    const robot = new THREE.Group()
    robot.position.set(4.6, -2.0, -3.2)
    scene.add(robot)

    // Base Flange & Mounting Ring
    const basePlateGeo = new THREE.CylinderGeometry(1.1, 1.25, 0.25, 20)
    const basePlate = createSolidMesh(basePlateGeo, mats.darkTitanium)
    basePlate.position.y = 0.125
    robot.add(basePlate)

    const baseTurretGeo = new THREE.CylinderGeometry(0.8, 0.95, 0.45, 18)
    const baseTurret = createSolidMesh(baseTurretGeo, mats.darkTitanium)
    baseTurret.position.y = 0.45
    robot.add(baseTurret)

    // Joint 1: Rotating Turret
    const j1 = new THREE.Group()
    j1.position.y = 0.68
    robot.add(j1)

    // Turret Upright Riser
    const riserGeo = new THREE.BoxGeometry(0.9, 0.95, 0.9)
    const riser = createSolidMesh(riserGeo, mats.orangePaint)
    riser.position.y = 0.45
    j1.add(riser)

    // Joint 2: Shoulder
    const j2 = new THREE.Group()
    j2.position.set(0, 0.88, 0)
    j1.add(j2)

    // Counterweight Knuckle
    const knuckleGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.9, 16)
    const knuckle = createSolidMesh(knuckleGeo, mats.darkTitanium)
    knuckle.rotation.z = Math.PI / 2
    j2.add(knuckle)

    // Primary Arm (Boom)
    const boomGeo = new THREE.BoxGeometry(0.48, 2.8, 0.55)
    const boom = createSolidMesh(boomGeo, mats.orangePaint)
    boom.position.set(0, 1.35, 0)
    j2.add(boom)

    // Hydraulic Balancing Cylinder
    const cylOuterGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.4, 12)
    const cylOuter = createSolidMesh(cylOuterGeo, mats.darkTitanium)
    cylOuter.position.set(0.28, 0.8, 0)
    j2.add(cylOuter)

    const pistonGeo = new THREE.CylinderGeometry(0.07, 0.07, 1.2, 12)
    const piston = createSolidMesh(pistonGeo, mats.chrome)
    piston.position.set(0.28, 1.5, 0)
    j2.add(piston)

    // Joint 3: Elbow
    const j3 = new THREE.Group()
    j3.position.set(0, 2.7, 0)
    j2.add(j3)

    const elbowKnuckleGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.8, 16)
    const elbowKnuckle = createSolidMesh(elbowKnuckleGeo, mats.darkTitanium)
    elbowKnuckle.rotation.z = Math.PI / 2
    j3.add(elbowKnuckle)

    // Forearm
    const forearmGeo = new THREE.BoxGeometry(0.38, 2.2, 0.42)
    const forearm = createSolidMesh(forearmGeo, mats.orangePaint)
    forearm.position.set(0, 1.05, 0)
    j3.add(forearm)

    // Joint 4/5/6: Wrist & Spot-Welding Tool
    const wrist = new THREE.Group()
    wrist.position.set(0, 2.1, 0)
    j3.add(wrist)

    const wristBallGeo = new THREE.SphereGeometry(0.28, 14, 14)
    const wristBall = createSolidMesh(wristBallGeo, mats.darkTitanium)
    wrist.add(wristBall)

    // Welding Gun Base
    const gunBodyGeo = new THREE.BoxGeometry(0.3, 0.6, 0.35)
    const gunBody = createSolidMesh(gunBodyGeo, mats.darkTitanium)
    gunBody.position.set(0, 0.42, 0)
    wrist.add(gunBody)

    // Copper Welding Tongs
    for (const tongSide of [-0.12, 0.12]) {
      const tongGeo = new THREE.BoxGeometry(0.06, 0.45, 0.06)
      const tong = createSolidMesh(tongGeo, mats.copper)
      tong.position.set(tongSide, 0.72, 0.08)
      wrist.add(tong)
    }

    // Arc Electrode Tip
    const weldTip = new THREE.Group()
    weldTip.position.set(0, 0.95, 0.08)
    wrist.add(weldTip)

    // Glowing tip bead
    const tipBeadGeo = new THREE.OctahedronGeometry(0.12)
    const tipBeadMat = new THREE.MeshBasicMaterial({ color: 0x34d399 })
    const tipBead = new THREE.Mesh(tipBeadGeo, tipBeadMat)
    weldTip.add(tipBead)

    // --- 6. SECONDARY ROBOT (INSPECTION / LASER SCANNER) ---
    const robot2 = new THREE.Group()
    robot2.position.set(-4.5, -2.0, -7.6)
    scene.add(robot2)

    const r2Base = createSolidMesh(new THREE.CylinderGeometry(0.9, 1.1, 0.35, 16), mats.darkTitanium)
    r2Base.position.y = 0.175
    robot2.add(r2Base)

    const r2J1 = new THREE.Group()
    r2J1.position.y = 0.4
    robot2.add(r2J1)
    const r2Turret = createSolidMesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), mats.orangePaint)
    r2Turret.position.y = 0.375
    r2J1.add(r2Turret)

    const r2J2 = new THREE.Group()
    r2J2.position.set(0, 0.75, 0)
    r2J1.add(r2J2)
    const r2Arm1 = createSolidMesh(new THREE.BoxGeometry(0.38, 2.2, 0.42), mats.orangePaint)
    r2Arm1.position.set(0, 1.05, 0)
    r2J2.add(r2Arm1)

    const r2J3 = new THREE.Group()
    r2J3.position.set(0, 2.15, 0)
    r2J2.add(r2J3)
    const r2Arm2 = createSolidMesh(new THREE.BoxGeometry(0.32, 1.8, 0.34), mats.orangePaint)
    r2Arm2.position.set(0, 0.85, 0)
    r2J3.add(r2Arm2)

    const r2LaserHead = createSolidMesh(new THREE.CylinderGeometry(0.2, 0.2, 0.5, 12), mats.darkTitanium)
    r2LaserHead.rotation.x = Math.PI / 2
    r2LaserHead.position.set(0, 1.8, 0)
    r2J3.add(r2LaserHead)

    // Sweeping Emerald Laser Fan Visual
    const laserBeamGeo = new THREE.ConeGeometry(1.2, 4.5, 4, 1, true)
    const laserBeamMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    })
    const laserBeam = new THREE.Mesh(laserBeamGeo, laserBeamMat)
    laserBeam.rotation.x = -Math.PI / 2
    laserBeam.position.set(0, 0, 2.25)
    r2LaserHead.add(laserBeam)

    // --- 7. STRUCTURAL STEEL GANTRIES & INDUSTRIAL PIPING ---
    const factoryStructure = new THREE.Group()
    scene.add(factoryStructure)

    // Overhead High-Bay Columns & Roof Trusses
    for (const x of [-16, 0, 16]) {
      // Columns
      for (const z of [-11, 2]) {
        const colGeo = new THREE.BoxGeometry(0.4, 11, 0.4)
        const col = createSolidMesh(colGeo, mats.gantryBeam)
        col.position.set(x, 3.5, z)
        factoryStructure.add(col)
      }

      // Overhead Roof Truss Beam
      const trussGeo = new THREE.BoxGeometry(0.35, 0.65, 14)
      const truss = createSolidMesh(trussGeo, mats.gantryBeam)
      truss.position.set(x, 8.8, -4.5)
      factoryStructure.add(truss)
    }

    // Longitudinal Crane Rails
    for (const z of [-10, 1]) {
      const craneRailGeo = new THREE.BoxGeometry(60, 0.5, 0.35)
      const craneRail = createSolidMesh(craneRailGeo, mats.gantryBeam)
      craneRail.position.set(0, 8.5, z)
      factoryStructure.add(craneRail)
    }

    // Industrial Process Piping Network (Paint Shop / Pneumatics)
    for (let pIdx = 0; pIdx < 3; pIdx++) {
      const pY = 7.4 - pIdx * 0.45
      const pZ = -10.2 + pIdx * 0.35
      const pipeGeo = new THREE.CylinderGeometry(0.12 - pIdx * 0.02, 0.12 - pIdx * 0.02, 60, 12)
      const pipeMat = pIdx === 0 ? mats.pipeYellow : mats.pipeSilver
      const pipe = createSolidMesh(pipeGeo, pipeMat, false)
      pipe.rotation.z = Math.PI / 2
      pipe.position.set(0, pY, pZ)
      factoryStructure.add(pipe)

      // Flange Rings every 8 meters
      for (let fx = -24; fx <= 24; fx += 8) {
        const flangeGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 14)
        const flange = createSolidMesh(flangeGeo, mats.darkTitanium, false)
        flange.rotation.z = Math.PI / 2
        flange.position.set(fx, pY, pZ)
        factoryStructure.add(flange)
      }
    }

    // --- 8. DYNAMIC WELDING SPARK PHYSICS SYSTEM ---
    const sparkCount = isMobile ? 80 : 220
    const sparkGeo = new THREE.BufferGeometry()
    const sparkPositions = new Float32Array(sparkCount * 3)
    const sparkColors = new Float32Array(sparkCount * 3)
    const sparkVelocities = []
    const sparkLives = new Float32Array(sparkCount)
    const sparkMaxLives = new Float32Array(sparkCount)

    for (let i = 0; i < sparkCount; i++) {
      sparkPositions[i * 3] = 999
      sparkPositions[i * 3 + 1] = 999
      sparkPositions[i * 3 + 2] = 999
      sparkVelocities.push(new THREE.Vector3())
      sparkLives[i] = 0
      sparkMaxLives[i] = 0.3 + Math.random() * 0.55
      sparkColors[i * 3] = 1.0
      sparkColors[i * 3 + 1] = 0.85
      sparkColors[i * 3 + 2] = 0.4
    }

    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3))
    sparkGeo.setAttribute('color', new THREE.BufferAttribute(sparkColors, 3))

    const sparkMat = new THREE.PointsMaterial({
      size: isMobile ? 0.09 : 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    })
    const sparkParticles = new THREE.Points(sparkGeo, sparkMat)
    scene.add(sparkParticles)

    // Ambient floating industrial dust motes
    const dustCount = isMobile ? 120 : 350
    const dustGeo = new THREE.BufferGeometry()
    const dustPositions = new Float32Array(dustCount * 3)
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 55
      dustPositions[i * 3 + 1] = Math.random() * 11 - 1.8
      dustPositions[i * 3 + 2] = -Math.random() * 22 - 2
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3))
    const dustMat = new THREE.PointsMaterial({
      color: 0x10b981,
      size: 0.045,
      transparent: true,
      opacity: 0.35,
    })
    const dustParticles = new THREE.Points(dustGeo, dustMat)
    scene.add(dustParticles)

    // --- 9. INTERACTIVE CONTROLS & ANIMATION LOOP ---
    let t = 0
    let prevTime = performance.now()
    let rafId = 0
    let scrollRatio = 0
    let mouseX = 0
    let mouseY = 0
    let targetCamX = 0
    let targetCamY = 2.4
    let targetCamZ = 11

    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      scrollRatio = maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const onResize = () => {
      const w = el.clientWidth || window.innerWidth
      const h = el.clientHeight || window.innerHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()

      // Adjust robot placement for mobile vs desktop
      if (w / h < 1.0) {
        robot.position.set(2.4, -2.0, -3.8)
        robot.scale.setScalar(0.85)
      } else {
        robot.position.set(4.6, -2.0, -3.2)
        robot.scale.setScalar(1.0)
      }
    }
    window.addEventListener('resize', onResize)
    onResize()
    onScroll()

    // Helper: Emit new sparks
    const emitSparks = (origin, count) => {
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * sparkCount)
        if (sparkLives[idx] <= 0) {
          sparkPositions[idx * 3] = origin.x + (Math.random() - 0.5) * 0.1
          sparkPositions[idx * 3 + 1] = origin.y + (Math.random() - 0.5) * 0.1
          sparkPositions[idx * 3 + 2] = origin.z + (Math.random() - 0.5) * 0.1

          const angle = Math.random() * Math.PI * 2
          const speed = 2.5 + Math.random() * 5.0
          sparkVelocities[idx].set(
            Math.cos(angle) * speed * 0.6,
            1.2 + Math.random() * 3.5, // burst upward then fall
            Math.sin(angle) * speed * 0.6
          )
          sparkLives[idx] = sparkMaxLives[idx]
        }
      }
    }

    const tipWorldPos = new THREE.Vector3()

    // Main Animation Loop
    const animate = (now) => {
      const dt = Math.min((now - prevTime) / 1000, 0.05)
      prevTime = now
      t += dt

      // Check mode changes
      const currentMode = modeRef.current
      const isCin = isCinematicRef.current

      // Toggle solid vs blueprint wireframe
      const showWireframe = currentMode === 'blueprint'
      for (let i = 0; i < wireframeLines.length; i++) {
        wireframeLines[i].visible = showWireframe
      }
      for (let i = 0; i < solidMeshes.length; i++) {
        solidMeshes[i].material.wireframe = showWireframe
      }

      // Conveyor & Car Motion
      const conveyorSpeed = 1.2
      for (let i = 0; i < cars.length; i++) {
        cars[i].position.x += dt * conveyorSpeed
        if (cars[i].position.x > 32) {
          cars[i].position.x -= cars.length * carSpacing
        }
      }

      // Rollers rotation
      for (let i = 0; i < rollers.length; i++) {
        rollers[i].rotation.x += dt * 4.5
      }

      // Robot 1 Articulated Kinematics (Welding Choreography)
      const weldCycle = (t * 0.9) % (Math.PI * 2)
      const isWelding = Math.sin(weldCycle) > -0.2 // Welding phase

      j1.rotation.y = Math.sin(t * 0.45) * 0.72 - 0.35
      j2.rotation.z = 0.45 + Math.sin(t * 0.7) * 0.28
      j3.rotation.z = -1.15 + Math.sin(t * 0.85) * 0.38
      wrist.rotation.x = Math.sin(t * 1.8) * 0.25
      wrist.rotation.y = Math.cos(t * 1.4) * 0.35

      // Get Tip Global Position
      weldTip.getWorldPosition(tipWorldPos)
      arcLight.position.copy(tipWorldPos)

      if (isWelding && !reduceMotion) {
        // High frequency electrical arc flicker
        const flicker = Math.random() > 0.08 ? 3.5 + Math.random() * 4.5 : 0.4
        arcLight.intensity = flicker
        tipBead.scale.setScalar(1.2 + Math.random() * 0.8)
        tipBeadMat.color.setHex(Math.random() > 0.5 ? 0xffffff : 0x34d399)

        // Spawn dynamic sparks
        emitSparks(tipWorldPos, isMobile ? 3 : 7)
      } else {
        arcLight.intensity = 0
        tipBead.scale.setScalar(0.7)
        tipBeadMat.color.setHex(0x064e3b)
      }

      // Secondary Robot Motion (Sweeping Laser Inspection)
      r2J1.rotation.y = Math.sin(t * 0.3) * 0.65 + 0.3
      r2J2.rotation.z = 0.5 + Math.sin(t * 0.5) * 0.22
      r2J3.rotation.z = -1.0 + Math.sin(t * 0.6) * 0.3
      r2LaserHead.rotation.y = Math.sin(t * 1.5) * 0.4
      laserSpot.intensity = 1.4 + Math.sin(t * 6) * 0.6

      // Update Spark Physics
      const posAttr = sparkGeo.attributes.position
      const colAttr = sparkGeo.attributes.color
      for (let i = 0; i < sparkCount; i++) {
        if (sparkLives[i] > 0) {
          sparkLives[i] -= dt
          const progress = 1 - sparkLives[i] / sparkMaxLives[i]

          // Gravity and velocity
          sparkVelocities[i].y -= 9.8 * dt
          sparkPositions[i * 3] += sparkVelocities[i].x * dt
          sparkPositions[i * 3 + 1] += sparkVelocities[i].y * dt
          sparkPositions[i * 3 + 2] += sparkVelocities[i].z * dt

          // Floor bounce
          if (sparkPositions[i * 3 + 1] < -2.0) {
            sparkPositions[i * 3 + 1] = -2.0
            sparkVelocities[i].y = -sparkVelocities[i].y * 0.38
            sparkVelocities[i].x *= 0.6
            sparkVelocities[i].z *= 0.6
          }

          // Dynamic cooling color gradient (white -> yellow -> orange -> dark red)
          if (progress < 0.25) {
            sparkColors[i * 3] = 1.0
            sparkColors[i * 3 + 1] = 1.0
            sparkColors[i * 3 + 2] = 0.9
          } else if (progress < 0.65) {
            sparkColors[i * 3] = 1.0
            sparkColors[i * 3 + 1] = 0.6
            sparkColors[i * 3 + 2] = 0.1
          } else {
            sparkColors[i * 3] = 0.8
            sparkColors[i * 3 + 1] = 0.15
            sparkColors[i * 3 + 2] = 0.05
          }
        } else {
          sparkPositions[i * 3] = 999
          sparkPositions[i * 3 + 1] = 999
          sparkPositions[i * 3 + 2] = 999
        }
      }
      posAttr.needsUpdate = true
      colAttr.needsUpdate = true

      // Floating dust particles gentle oscillation
      const dustPos = dustGeo.attributes.position
      for (let i = 0; i < dustCount; i++) {
        dustPositions[i * 3 + 1] += Math.sin(t * 0.8 + i) * 0.002
        if (dustPositions[i * 3 + 1] > 9) dustPositions[i * 3 + 1] = -1.5
      }
      dustPos.needsUpdate = true

      // Camera Path Interpolation: Scroll-linked + Mouse Parallax + Cinematic Tour
      if (isCin) {
        // Auto-panning cinematic tour
        targetCamX = Math.sin(t * 0.25) * 5.2
        targetCamY = 2.0 + Math.sin(t * 0.35) * 1.2
        targetCamZ = 9.5 + Math.cos(t * 0.2) * 2.5
      } else {
        // Interactive Scroll & Parallax
        const parallaxX = mouseX * 1.2
        const parallaxY = mouseY * 0.8
        targetCamX = Math.sin(scrollRatio * Math.PI * 1.8) * 3.8 + parallaxX
        targetCamY = 1.8 + scrollRatio * 2.8 + parallaxY
        targetCamZ = 10.5 - scrollRatio * 3.2
      }

      camera.position.x += (targetCamX - camera.position.x) * 0.06
      camera.position.y += (targetCamY - camera.position.y) * 0.06
      camera.position.z += (targetCamZ - camera.position.z) * 0.06

      // Look slightly to the right of the welding cell
      camera.lookAt(0.8, -0.4, -5.4)

      renderer.render(scene, camera)

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)

      // Cleanup Geometries & Materials
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
          else obj.material.dispose()
        }
      })
      renderer.dispose()
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="scene-wrapper" aria-hidden="true">
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        className="scene"
        style={{ display: mode === 'video' ? 'none' : 'block' }}
      />

      {/* 3D Video Background Mode */}
      {mode === 'video' && (
        <div className="video-background-layer">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="scene-video-player"
            src={customVideoUrl || '/video/automotive-welding-3d.mp4'}
            onError={() => setVideoError(true)}
            onLoadedData={() => setVideoError(false)}
          />
          {videoError && (
            <div className="video-fallback-notice">
              <span>⚠️ No default video found at <code>/public/video/automotive-welding-3d.mp4</code></span>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                Upload any 3D automotive / robotic factory MP4 or switch to the live 3D simulation:
              </p>
              <label className="upload-video-label">
                📁 Upload 3D Video (.mp4)
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setCustomVideoUrl(URL.createObjectURL(file))
                      setVideoError(false)
                    }
                  }}
                  style={{ display: 'none' }}
                />
              </label>
              <button className="hud-btn" onClick={() => setMode('shaded')}>
                ⚡ Return to 3D Simulation
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
