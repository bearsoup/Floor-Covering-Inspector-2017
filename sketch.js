/*
 *** FLOOR COVERING INSPECTOR 2017 ***
 ****** Simon Boas, 2017 ******
 ***** www.simonboas.com *****
 */

var ptext1 = 'In the Trump administration\'s first official press conference, White House Press Secretary Sean Spicer scolded the media for its alleged \"attempts to lessen the enthusiasm\" of Trump\'s inaguration:';
var ptext2 = '\"Photographs of the inaugural proceedings were intentionally framed in a way, in one particular tweet, to minimize the enormous support that had gathered on the National Mall. This was the first time in our nation\'s history that floor coverings have been used to protect the grass on the Mall. That had the effect of highlighting any areas where people were not standing, while in years past the grass eliminated this visual.\"';
var ptext3 = 'This P5.js sketch is for Spicer, to help him spot the differences in crowd sizes between Trump\'s 2017 inauguration, Obama\'s 2009 inauguration, and an empty National Mall. He can comb through the pixels of each image and discern which are people, which are grass and which are bright white floor covering.';

//declare various global variables
var gitbtn;
var cnv, h1, p1, p2, p3, pdiv;
var cw; //scaled canvas width
var ch; //scaled canvas height
var img_empty; //images
var img_trump;
var img_obama;
var mx; //mouse constraints
var my;
var mxMap; //mapped mouse constraints for responsiveness
var myMap;
var tOriginX; //origin points of individual images
var oOriginx;
var omxDest; //obama mouse position offset
var mxCopy; //mouse posiiton offset for copying pixels to enlarge
var eColor; //pixel colors
var tColor;
var oColor;

function centerCanvas() {
    var x = (windowWidth - width) / 2;
    cnv.position(x);
}

function positionPdiv() {
    dy = gitbtn.height + cnv.height + h1.height + 40;
    pdiv.position(AUTO, dy);
}

function setup() {
    cw = constrain(windowWidth, 360, 1080);
    ch = constrain(windowWidth / 2, 0, 540);

    h1 = createElement('h1', 'Floor Covering Inspector 2017'); //create h1
    gitbtn = select('#gitbtn'); //select github button to get height

    cnv = createCanvas(cw, ch); //draw the canvas to the DOM
    centerCanvas();

    //create description ps and containing div
    pdiv = createDiv('');

    p1 = createP(ptext1);
    p2 = createP(ptext2);
    p3 = createP(ptext3);

    positionPdiv();

    p1.parent(pdiv);
    p2.parent(pdiv);
    p3.parent(pdiv);

    //load three images into the sketch. one of the three images may or may not present alternative facts.
    img_empty = loadImage("assets/empty.jpg"); //the DC mall without any people in it. there probably wasn't a presidential inauguration happening in the day this photo was taken
    img_trump = loadImage("assets/trump.jpg"); //the DC mall during Obama's inauguration in 2009
    img_obama = loadImage("assets/obama.jpg"); //the DC mall during Trump's inauguration in 2017
}

function draw() {

    //assign image positions
    tOriginX = cw / 3;
    oOriginX = (cw / 3) * 2;

    //hide cursor unless mouse is pressed
    if ((mouseX > oOriginX) || (mouseX < tOriginX) || (mouseY > img_empty.height)) {
        cursor(CROSS);
    } else {
        noCursor();
    }

    //constrain mouse movements on the canvas to trump's .jpg
    mx = int(constrain(mouseX, tOriginX + (cw / 100), oOriginX - (cw / 100)));
    my = int(constrain(mouseY, cw / 100, (ch * (2 / 3)) - (cw / 100)));

    //draw three images to the canvas
    image(img_empty, 0, 0, cw / 3, (ch * (2 / 3)));
    image(img_trump, tOriginX, 0, cw / 3, (ch * (2 / 3)));
    image(img_obama, oOriginX, 0, cw / 3, (ch * (2 / 3)));

    //map scaled mx and my to full image widths
    mxMap = map(mx, 0, cw / 3, 0, img_empty.width);
    myMap = map(my, 0, ch * (2 / 3), 0, img_empty.width);

    //get the color of the pixel under the mouse in each photo
    eColor = img_empty.get(mxMap - img_empty.width, myMap);
    tColor = img_trump.get(mxMap - img_empty.width, myMap);
    oColor = img_obama.get(mxMap - img_empty.width, myMap);

    //draw a rectangle the color of the corresponding selected pixel below each image
    noStroke();
    fill(eColor);
    rect(0, ch * (2 / 3), cw / 3, ch - (ch * (2 / 3)));
    fill(tColor);
    rect(tOriginX, ch * (2 / 3), cw / 3, ch - (ch * (2 / 3)));
    fill(oColor);
    rect(oOriginX, ch * (2 / 3), cw / 3, ch - (ch * (2 / 3)));

    //offset mouse position for copying image pixels
    mxCopy = mxMap - (img_empty.width);
    omxDest = mx + (cw / 3);

    //create pixel magnifiers for each image
    stroke(255);
    strokeWeight(2);
    noFill();
    ///trump
    copy(img_trump, mxCopy, myMap, 10, 10, mx - 20, my - 20, 40, 40);
    rect(mx - 21, my - 21, 41, 41, 5);
    ///obama
    copy(img_obama, mxCopy, myMap, 10, 10, omxDest - 20, my - 20, 40, 40);
    rect(omxDest - 21, my - 21, 41, 41, 5);
    ///empty
    copy(img_empty, mxCopy, myMap, 10, 10, (mx - (cw / 3)) - 20, my - 20, 40, 40);
    rect((mx - (cw / 3)) - 21, my - 21, 41, 41, 5);
}



function windowResized() {
    resizeCanvas(cw = constrain(windowWidth, 360, 1080), ch = constrain(windowWidth / 2, 0, 540));
    centerCanvas();
    positionPdiv();
}
