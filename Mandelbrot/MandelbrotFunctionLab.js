function draw() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const julia_canvas = document.getElementById('julia-canvas');
    const jtx = julia_canvas.getContext('2d');
    
    // Basic scale setup
    let iterations = 8;// 1822;   // maximum loop count per pixel
    let range = 4; // 0.0006104;          // +/- 2 units on the x-axis
    plotFractal(-0.8180664062499996, -0.19941406249999982, 0.3125, 77, julia_canvas, jtx);
    plotFractal(0, 0, range, iterations, canvas, ctx);

    // Document References for real-time
    const x_coord = document.getElementById('x_coord');
    const y_coord = document.getElementById('y_coord');
    const iter_max = document.getElementById('iterations');

    iter_max.innerHTML = iterations;

    canvas.addEventListener('wheel', (e) => {
        const delta = Math.sign(e.deltaY);
        if(iterations > 1 || delta < 0) {
            iterations -= delta * Math.ceil(iterations / 10);
            iter_max.innerHTML = iterations;
        }
    });

    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        range *= 2;
        plotFractal(x_coord.innerHTML, -y_coord.innerHTML, range, iterations, canvas, ctx);
    });

    canvas.addEventListener('mousedown', (e) => {
        switch(e.button) {
            case 0:
                range /= 2;
                break;
            case 1:
                break;
        }
        plotFractal(x_coord.innerHTML, -y_coord.innerHTML, range, iterations, canvas, ctx);
        iter_max.innerHTML = iterations;
    }); 
}

function plotColorSpectrum(iter_count, canvas, ctx) {
    const increment = canvas.width / iter_count;
    for(let i = 0; i <= (increment * iter_count); i+= increment) {
        ctx.fillStyle = color(i, canvas.width);
        ctx.fillRect(i, 0, increment, canvas.height);
    }
}

function plotFractal(a_center, b_center, range, iter_count, canvas, ctx) {
    // Draw black background
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const color_spectrum = document.getElementById('color-spectrum');
    const stx = color_spectrum.getContext('2d');
    plotColorSpectrum(iter_count, color_spectrum, stx);
    // Record Frame
    document.getElementById('a-center').innerHTML = a_center;
    document.getElementById('b-center').innerHTML = -b_center;
    document.getElementById('range').innerHTML = range;
    document.getElementById('iter-max').innerHTML = iter_count;
 
    let a_left = a_center - range / 2;
    let x_scale = range / canvas.width; // real a units per pixel
    let b_bottom = b_center - range * canvas.height / canvas.width / 2;    // set y-axis based on x-axis
    let z_sqr_1, z_sqr_2;  // a^2 and b^2
    let x, y;  // canvas coordinates, origin (0, 0) upper left
    let a, b;  // a+bi complex coordinates, center origin
    let escape_count = 0;


    for(y = 0; y < canvas.height; y++) {        // loop through rows
        b = b_bottom + y * x_scale;             // imaginary component matches x_scale
        for(x = 0; x < canvas.width; x++) {     // loop through columns
            a = a_left + x * x_scale;           // real component of complex plane
            let z = [a, b];                         // coordinate vector
            let c = [a, b];  //[-0.892, -0.227];    // seed vector
            for(let j = 0; j < iter_count; j++) {   // loop through iterations
                z_sqr_1 = z[0] * z[0]; z_sqr_2 = z[1] * z[1];
                // iterative function z->z^2 + c
                z = [(z_sqr_1 - z_sqr_2) + c[0], 2 * z[0] * z[1] + c[1]];
                if((z_sqr_1 + z_sqr_2) > 4) {  // escape condition
                    ctx.fillStyle = color(j, iter_count);  // black if not in the set
                    ctx.fillRect(x, y, 1, 1);
                    break;                          // next coordinate
                }
            }
        }
    }
      
    canvas.addEventListener('mousemove', (e) => {
        x_coord.innerHTML = a_left + e.offsetX * x_scale;
        y_coord.innerHTML = -(b_bottom + e.offsetY * x_scale);
        });
}

/* color(a given number of iterations, the maximum number of iterations)
    returns spectrum of black, purple, blue, cyan, green, yellow, red, white, black 
    as an rgba(r,g,b,a) string*/
function color(iters, iter_max) {
    const normalized_var = iters / iter_max;    // scaled to 0 - 0.999
    const steps = 8.0;
    let step = steps * normalized_var;          // scaled to 0 - steps

    if(step < 1) {return `rgba(${Math.floor(255 * step)}, ${0}, ${Math.floor(255 * step)}, 1)`;}
    if(step < 2) {return `rgba(${Math.floor(255 - 255 * (step - 1))}, ${0}, ${255}, 1)`;}
    if(step < 3) {return `rgba(${0}, ${Math.floor(255 * (step - 2))}, ${255}, 1)`;}
    if(step < 4) {return `rgba(${0}, ${255}, ${Math.floor(255 - 255 * (step - 3))}, 1)`;}
    if(step < 5) {return `rgba(${Math.floor(255 * (step - 4))}, ${255}, ${0}, 1)`;}
    if(step < 6) {return `rgba(${255}, ${Math.floor(255 - 255 * (step - 5))}, ${0}, 1)`;}
    if(step < 7) {return `rgba(${255}, ${Math.floor(255 * (step - 6))}, ${Math.floor(255 * (step - 6))}, 1)`;}
    if(step < 8) {return `rgba(${Math.floor(255 - 255 * (step - 7))}, ${255 - 255 * (step - 7)}, ${255 - 255 * (step - 7)}, 1)`;}
    return 'rgba(0, 0, 0, 1)';
} 