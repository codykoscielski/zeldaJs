//Initilize Kaboom
kaboom({
    global: true,
    width: 480,
    height: 480,
    scale: 1,
    debug: true,
})

const MOVE_SPEED = 120

loadRoot('sprites/')
loadSprite('link-left', 'link-left.png')
loadSprite('link-right', 'link-right.png')
loadSprite('link-down', 'link-down.png')
loadSprite('link-up', 'link-top.png')
loadSprite('left-wall', 'left-wall.png')
loadSprite('top-wall', 'top-wall.png')
loadSprite('bottom-wall', 'bottom-wall.png')
loadSprite('right-wall', 'right-wall.png')
loadSprite('bottom-left-wall', 'bottom-left-wall.png')
loadSprite('bottom-right-wall', 'bottom-right-wall.png')
loadSprite('top-left-wall', 'top-left-wall.png')
loadSprite('top-right-wall', 'top-right-wall.jpg')
loadSprite('top-door', 'top-door.png')
loadSprite('fire-pot', 'fire-pot.png')
loadSprite('left-door', 'left-door.png')
loadSprite('lanterns', 'lanterns.png')
loadSprite('slicer', 'slicer.png')
loadSprite('skeletor', 'skeletor.png')
loadSprite('boom', 'boom.png')
loadSprite('stairs', 'stairs.png')
loadSprite('background', 'background.png')

scene("game", ({level}) => {

    layers(['background', 'obj', 'ui'], 'obj')

    const maps = [
        [
            'edd#dd<ddf',
            'a        j',
            'a     $  j',
            'a    @   j',
            '>        j',
            'a    @   j',
            'a   $    j',
            'a        j',
            'a        j',
            'gbb#bbb#bh'
        ],
        [
            'edd#dddd#f',
            'a        j',
            'a        j',
            'a        j',
            'a        j',
            'a     ^  j',
            'a    *   j',
            'a        j',
            'a        j',
            'gbb#bbb#bh'
        ],
        [
            'edd#dd#ddf',
            'a        j',
            'a        j',
            'a        j',
            'a        j',
            'a        j',
            'a        j',
            'a        j',
            'a        j',
            'gbb#bbb#bh' 
        ]
    ]

    const levelCfg = {
        width: 48,
        height: 48,
        'a' : [sprite('left-wall'), solid(), 'wall'],
        'b' : [sprite('bottom-wall'), solid(), 'wall'],
        'd' : [sprite('top-wall'), solid(), 'wall'],
        'e' : [sprite('top-left-wall'), solid()],
        'f' : [sprite('top-right-wall'), solid()],
        'g' : [sprite('bottom-left-wall'), solid()],
        'h' : [sprite('bottom-right-wall'), solid()],
        'j' : [sprite('right-wall'), solid(), 'wall'],
        '$' : [sprite('slicer'), 'slicer', {dir: -1}, 'dangerous'],
        '*' : [sprite('skeletor'), 'dangerous', 'skeletor', {dir: -1, timer: 0}],
        '>' : [sprite('left-door')],
        '^' : [sprite('stairs'), 'next-level'],
        '<' : [sprite('top-door'), 'next-level'],
        '#' : [sprite('lanterns'), solid()],
        '@' : [sprite('fire-pot'), solid()],
        '!' : [sprite('boom'), solid(), 'boom']
    }
    addLevel(maps[level], levelCfg)

    add([sprite('background'), layer('background')])

    add([
        text('Level ' + parseInt(level + 1)),
        pos(200, 450)
    ])

    const link = add([
        sprite('link-right'),
        pos(50,190),
        {
            //Right by default
            dir: vec2(1,0)
        }
    ])

    link.action( () => {
        link.resolve()
    })

    link.overlaps('next-level', () => {
        go("game", {
            level: (level + 1)
        })
    })

    keyDown('left', () => {
        link.changeSprite('link-left')
        link.move(-MOVE_SPEED, 0)
        link.dir = vec2(-1, 0)
    })

    keyDown('right', () => {
        link.changeSprite('link-right')
        link.move(MOVE_SPEED, 0)
        link.dir = vec2(1, 0)
    })

    keyDown('up', () => {
        link.changeSprite('link-up')
        link.move(0, -MOVE_SPEED)
        link.dir = vec2(0, -1)
    })

    keyDown('down', () => {
        link.changeSprite('link-down')
        link.move(0, MOVE_SPEED)
        link.dir = vec2(0, 1)
    })

    const SLICER_SPEED = 100

    action('slicer', (s) => {
        s.move(s.dir * SLICER_SPEED, 0)
    })

    collides('slicer', 'wall', (s) => {
        s.dir = -s.dir
    })

    link.overlaps('dangerous', () => {
        go('lose')
    })

    //Kill skeletor
    function spawnBoom(l) {
        const obj = add([
            sprite('boom'),
            pos(l),
            'boom'
        ])
        wait(.5, () => {
            destroy(obj)
        })
    }

    keyPress('space', () => {
        spawnBoom(link.pos.add(link.dir.scale(48)))
    })

    collides('boom', 'skeletor', (b,s) => {
        camShake(4)
        wait(.5, () => {
            destroy(b)
        })
        destroy(s)
    })

    const SKELETOR_SPEED = 60

    action('skeletor', (s) => {
        s.move(0, s.dir * SKELETOR_SPEED)
        s.timer -= dt()

        if(s.timer <= 0) {
            s.dir = -s.dir
            s.timer = rand(5)
        }
    })

    collides('skeletor', 'wall', (s) => {
        s.dir = -s.dir
    })
})

scene("lose", () => {
    add([text('You Died', 32), origin('center'), pos(width() / 2, height() / 2)])
})

start("game", {level: 0})