// var stage = new NGL.Stage("viewport");
document.addEventListener("DOMContentLoaded", function () {
stage = new NGL.Stage("viewport");
stage.mouseControls.remove( "scroll-shift" );

stage.setParameters({
  backgroundColor: "white",
  cameraType: "orthographic",
  tooltip: false,
  clipDist: 0,
  lightIntensity: 1.13
})

function addElement(el) {
  Object.assign(el.style, {
    position: "absolute",
    zIndex: 10
  })
  stage.viewer.container.appendChild(el)
}

function createElement(name, properties, style) {
  var el = document.createElement(name)
  Object.assign(el, properties)
  Object.assign(el.style, style)
  return el
}

function createSelect(options, properties, style) {
  var select = createElement("select", properties, style)
  options.forEach(function (d) {
    select.add(createElement("option", {
      value: d[0],
      text: d[1]
    }))
  })
  return select
}

var scrollPIPs, scrollCHOL
function isolevelScroll(stage, delta) {
  var d = Math.sign(delta) / 10
  stage.eachRepresentation(function (reprElem) {
    var p
    if (scrollPIPs && reprElem === surfPIPs) {
      p = reprElem.getParameters()
      reprElem.setParameters({
        isolevel: Math.max(0.01, p.isolevel + d)
      })
    } else if (scrollCHOL && (reprElem === surfCHOL)) {
      p = reprElem.getParameters()
      reprElem.setParameters({
        isolevel: Math.max(0.01, p.isolevel + d)
      })
    }
  })
}
stage.mouseControls.add("scroll-shift", isolevelScroll)


function loadStructure(input, name="N/A", pdbID="#") {
  struc = undefined
  surfPIPs = undefined
  surfCHOL = undefined
  labelPosition.value = 10
  toggleLabelButton.value = "Show Labels"
  toggleBfactorButton.value = "Show DURATION map"
  annotationButton.value = "Show TM Annotations"
  isolevelPIPsText.innerText = ""
  isolevelCHOLText.innerText = ""
  stage.setFocus(0)
  stage.removeAllComponents()
  return stage.loadFile(input).then(function (o) {
    // gpcrNameText.innerText = name
    gpcrNameText.innerHTML = '<a href="https://www.rcsb.org/structure/' + pdbID
                              + '" target="_blank">' + name + '</a>'
    STATE = 2
    struc = o

    o.addRepresentation("cartoon", {
      radiusType: "size",
      colorScheme: "residueindex"
    })
    var bfType = o.name.split("_")[2].split(".")[0];
    if (bfType == "DURATION") {
      bfDURATION = o.addRepresentation("surface", {
        surfaceType: "av",
        probeRadius: 2.1,
        sele: ".BB",
        opacity: 0.7,
        clipNear: 0
      })
    } else if (bfType == "NUMBER") {
      bfNUMBER = o.addRepresentation("surface", {
        surfaceType: "av",
        probeRadius: 2.1,
        sele: ".BB",
        opacity: 0.7,
        clipNear: 0
      })
      bfNUMBER.toggleVisibility();
    }
    if (bfType == "DURATION") {
      labelNameDURATION = o.addRepresentation("label", {
        labelType: "format",
        labelFormat: "%(resno)s%(resname)s",
        labelGrouping: "residue",
        fontWeight: "normal",
        radiusType: "bfactor",
        showBackground: true,
        backgroundColor: "red",
        backgroundOpacity: 100,
        zOffset: 10,
        color: "white",
      })
      labelNameDURATION.parameters.showL = showLabel(labelNameDURATION, 10);
      labelNameDURATION.toggleVisibility();

      var bf = Array.from(labelNameDURATION.parent.structure.atomStore.bfactor);
      var bfMax = Math.max.apply(null, bf);
      labelNameDURATION.setParameters({
        radiusScale: getBfMax(bfMax)
      })

    } else if (bfType == "NUMBER") {
      labelNameNUMBER = o.addRepresentation("label", {
        labelType: "format",
        labelFormat: "%(resno)s%(resname)s",
        labelGrouping: "residue",
        fontWeight: "normal",
        radiusType: "bfactor",
        showBackground: true,
        backgroundColor: "red",
        backgroundOpacity: 100,
        zOffset: 10,
        color: "white",
      })
      labelNameNUMBER.parameters.showL = showLabel(labelNameNUMBER, 10);
      labelNameNUMBER.toggleVisibility();

      var bf = Array.from(labelNameNUMBER.parent.structure.atomStore.bfactor);
      var bfMax = Math.max.apply(null, bf);
      labelNameNUMBER.setParameters({
        radiusScale: getBfMax(bfMax)
      })


      var chainData = [{
          text: "TMH 1",
          color: "darkred"
        },
        {
          text: "TMH 2",
          color: "orangered"
        },
        {
          text: "TMH 3",
          color: "orange"
        },
        {
          text: "TMH 4",
          color: "khaki"
        },
        {
          text: "TMH 5",
          color: "PaleTurquoise"
        },
        {
          text: "TMH 6",
          color: "lightblue"
        },
        {
          text: "TMH 7",
          color: "royalblue"
        }
      ]

      var zAxisList = []
      for (i = 0; i < parseInt(o.structure.atomCount); i++) {
        var ap = o.structure.getAtomProxy(i).z
        zAxisList.push(ap);
      }
      zMax = Math.max.apply(null, Array.from(zAxisList));
      zMin = Math.min.apply(null, Array.from(zAxisList));
      zMid = ((zMax - zMin) / 2) + zMin

      var ap = o.structure.getAtomProxy()

      apIndexSkip = 10
      chainDataIndex = 0

      var strucName = o.name.split("_")[0]

      o.structure.eachResidue(function (cp) {

        zMid = Math.floor(parseFloat(zMid))
        cpZ = Math.floor(cp.z)
        ap.index = cp.atomOffset + Math.floor(cp.atomCount / 2)

        if ((cpZ - 3 <= zMid) && (cpZ + 3 >= zMid)) {
          if (ap.index > apIndexSkip) {
            var elm = document.createElement("div1")
              // apStatus = false
          } else {
            var elm = document.createElement("div2")
          }
        } else {
          var elm = document.createElement("div2")
        }

        // var elm = document.createElement("div")

        if ((cpZ - 3 <= zMid) && (cpZ + 3 >= zMid)) {

          if (ap.index > apIndexSkip) {

            elm.innerText = chainData[chainDataIndex].text
            elm.style.color = "white"
            elm.style.backgroundColor = chainData[chainDataIndex].color
            elm.style.padding = "8px"
            elm.style.fontSize = "15px"
            chainDataIndex += 1

          apIndexSkip = ap.index + 10
          }
        }

      tmAnnotation = o.addAnnotation(ap.positionToVector3(), elm)
      }, new NGL.Selection("polymer"))

      hc = document.getElementsByTagName("div1");
      for (var i = 0; i < hc.length; i++) {
        hc[i].hidden = true;
      }

      // if (struc.name.includes("NUMBER")) {strucNUMBER = o}
      // strucNUMBER.eachAnnotation(a => { a.setVisibility(false) })

    }
  })
}

// Adjust the label size showing.
function getBfMax(bfMax) {
  if (bfMax <= 20) {
    var radScale = 0.2;
  } else if (bfMax >= 20 && bfMax <= 30) {
    var radScale = 0.15;
  } else if (bfMax > 30 && bfMax <= 40) {
    var radScale = 0.1;
  } else if (bfMax > 40 && bfMax <= 50) {
    var radScale = 0.07;
  } else if (bfMax > 50) {
    var radScale = 0.07;
  }
  return radScale
}

// Selection to be parsed for showing labels based on bfactors.
function showLabel(e, E) {
  var arr = Array.from(e.parent.structure.atomStore.bfactor)
  ARR = showAtom(arr, E);
  str = "";
  for (i = 0; i < ARR.length; i++) {
    str = str + ARR[i] + ", ";
  }
  if (str.length == 0) {
    e.setSelection(",");
  } else {
    e.setSelection(str);
  }
}

// Select only atoms that fit the bfactor cutoff.
function showAtom(arr, E) {
  var ARR = []
  for (i = 0; i < arr.length; i++) {
    if (arr[i] < E) {
      continue
    } else {
      ARR.push(i + 1);
    }
  }
  return ARR
}

// Load the PIP lipid density file
var surfPIPs;
var sliceRepr;
function loadPIPs(input) {
  return stage.loadFile(input).then(function (o) {
    isolevelPIPsText.innerText = "PIPs density level: 6.0"//\u03C3"
    scrollSelect.value = "both"
    scrollPIPs = true
    surfPIPs = o.addRepresentation("surface", {
      color: "darkmagenta",
      isolevel: 6.0,
      boxSize: 40,
      useWorker: false,
      contour: false,
      opaqueBack: false,
      background: false,
      isolevelScroll: false,
      opacity: 0.8
    })
    sliceRepr = o.addRepresentation("slice", {
      dimension: "x",
      positionType: "percent",
      filter: "cubic-catmulrom",
      colorScale: "Viridis",
    })
    sliceRepr.toggleVisibility()
  })
}

// Load the cholesterol density file.
var surfCHOL, sliceReprCHOL
function loadCHOL(input) {
  return stage.loadFile(input).then(function (o) {
    isolevelCHOLText.innerText = "Chol level: 6.0"//\u03C3"
    scrollSelect.value = "both"
    scrollCHOL = true
    surfCHOL = o.addRepresentation("surface", {
      color: "#f40f68",
      isolevel: 6.0,
      boxSize: 40,
      useWorker: true,
      contour: false,
      opaqueBack: false,
      isolevelScroll: false,
      opacity: 0.8
    })
    sliceReprCHOL = o.addRepresentation("slice", {
      dimension: "x",
      positionType: "percent",
      // colorScale: "Viridis",
      filter: "cubic-catmulrom",
    })
    sliceReprCHOL.toggleVisibility()
  })
}

var exampleSelect = createSelect([
  ["", "choose GPCR"],
  ["5HT1B", "5HT1B"],
  ["A2ARa", "A2ARa"],
  ["A2ARi", "A2ARi"],
  ["ApelinR", "ApelinR"],
  ["AT2R", "AT2R"],
  ["b2ARa", "b2ARa"],
  ["b2ARi", "b2ARi"],
  ["CalcitoninR", "CalcitoninR"],
  ["CB1R", "CB1R"],
  ["CXCR1", "CXCR1"],
  ["D3R", "D3R"],
  ["ETbR", "ETbR"],
  ["GLP1", "GLP1"],
  ["GlucagonR", "GlucagonR"],
  ["H1R", "H1R"],
  ["LPAR1", "LPAR1"],
  ["M2Ra", "M2Ra"],
  ["M2Ri", "M2Ri"],
  ["mGlu5", "mGlu5"],
  ["mORa", "mORa"],
  ["mORi", "mORi"],
  ["OX2R", "OX2R"],
  ["PAR2", "PAR2"],
  ["RhodRa", "RhodRa"],
  ["RhodRi", "RhodRi"],
  ["S1PR1", "S1PR1"],
  ["SMO", "SMO"],
  ["US28", "US28"],
], {
  onchange: function (e) {
    var id = e.target.value
    loadGPCR(id)
  }
}, {
  top: "8em",
  left: "1em"
})
addElement(exampleSelect)

// A few surface representations for the density maps.
var surfaceSelect = createSelect([
  ["smooth", "smooth"],
  ["wireframe", "wireframe"],
  ["contour", "contour"],
  ["flat", "flat"]
], {
  onchange: function (e) {
    var v = e.target.value
    var p
    if (v === "contour") {
      p = {
        contour: true,
        flatShaded: false,
        opacity: 1,
        metalness: 0,
        wireframe: false
      }
    } else if (v === "wireframe") {
      p = {
        contour: false,
        flatShaded: false,
        opacity: 1,
        metalness: 0,
        wireframe: true
      }
    } else if (v === "smooth") {
      p = {
        contour: false,
        flatShaded: false,
        opacity: 0.7,
        metalness: 0,
        wireframe: false
      }
    } else if (v === "flat") {
      p = {
        contour: false,
        flatShaded: true,
        opacity: 0.7,
        metalness: 0.2,
        wireframe: false
      }
    }
    // The numbers 2 and 3 select only the lipid (and not protein) surfaces.
    stage.getRepresentationsByName("surface").list[2].setParameters(p)
    stage.getRepresentationsByName("surface").list[3].setParameters(p)
  }
}, {
  // top: "15%",
  top: "12em",
  // left: "0.5%"
  left: "1em"
})
addElement(surfaceSelect)

// Button to select the direction of the slice representation.
var sliceDirection = createSelect([
  ["x", "x"],
  ["y", "y"],
  ["z", "z"]
], {
  onchange: function (e) {
    var v = e.target.value
    var p
    if (v === "x") {
      p = {
        dimension: "x",
      }
    } else if (v === "y") {
      p = {
        dimension: "y"
      }
    } else if (v === "z") {
      p = {
        dimension: "z"
      }
    }
    stage.getRepresentationsByName("slice").setParameters(p)
  }
}, {
  // top: "36.1%",
  top: "26.3em",
  left: "1em"
})
addElement(sliceDirection)

// Button to toggle the visibility of the PIP density.
var togglePipsButton = createElement("input", {
  id: "button2",
  type: "button",
  value: "toggle PIPs",
  onclick: function (e) {
    surfPIPs.toggleVisibility()
  }
}, {
  // top: "26.3%",
  top: "19.7em",
  left: "1em"
})
addElement(togglePipsButton)

// Button to toggle the visibility of the cholesterol density.
var toggleCholButton = createElement("input", {
  id: "button1",
  type: "button",
  value: "toggle CHOL",
  onclick: function (e) {
    surfCHOL.toggleVisibility()
  }
}, {
  // top: "23%",
  top: "17.5em",
  // left: "0.5%"
  left: "1em"
})
addElement(toggleCholButton)

// Button to toggle the visibility of the PIP slice representation.
var togglePIPsSliceButton = createElement("input", {
  id: "button4",
  type: "button",
  value: "toggle PIPs slice",
  onclick: function (e) {
    sliceRepr.toggleVisibility()
  }
}, {
  // top: "32.8%",
  top: "24.1em",
  left: "1em"
})
addElement(togglePIPsSliceButton)

// Button to toggle the visibility of the cholesterol slice representation.
var toggleCHOLSliceButton = createElement("input", {
  id: "button3",
  type: "button",
  value: "toggle CHOL slice",
  onclick: function (e) {
    sliceReprCHOL.toggleVisibility()
  }
}, {
  // top: "29.5%",
  top: "21.9em",
  left: "1em"
})
addElement(toggleCHOLSliceButton)


// Button to toggle the bfactor type coloring of the protein surfaces.
// bfactors here represent the DURATION and NUMBER of contacts, and can
// be toggled between them or only white coloring (NONE).
var toggleBfactorButton = createElement("input", {
  id: "bfButton",
  type: "button",
  value: "Show DURATION map",
  onclick: function (e) {

    bfNUMBER.setParameters({
      colorScheme: "bfactor"
    })
    bfDURATION.setParameters({
      colorScheme: "bfactor"
    })

    // This is important to ensure the correct labels are bein manipulated.
    if (STATE == 2) {
      STATE = 1;
    } else if (STATE == 0) {
      STATE = 2;
    } else if (STATE == 1) {
      STATE = 0
    }

    // Ugly piece of code.
    var bfButton = document.getElementById("bfButton").value;

    if (bfButton.includes("DURATION")) {
      if (!bfDURATION.toggleVisibility().visible) {
        bfDURATION.toggleVisibility();
      }
      if (bfNUMBER.toggleVisibility().visible) {
        bfNUMBER.toggleVisibility();
      }

      if (document.getElementById("labelButton").value.includes("Hide")) {
        document.getElementById("labelButton").click();
      }
      document.getElementById("bfButton").value = "Show NUMBER map";
      document.getElementById("labelButton").disabled = false;
      document.getElementById("labelButton").style.opacity = 1;
      // document.getElementById("labelSlider").disabled = false;
      // document.getElementById("labelSlider").style.opacity = 1;
    }

    else if (bfButton.includes("NUMBER")) {

      if (bfDURATION.toggleVisibility().visible) {
        bfDURATION.toggleVisibility();
      }
      if (!bfNUMBER.toggleVisibility().visible) {
        bfNUMBER.toggleVisibility();
      }
      if (document.getElementById("labelButton").value.includes("Hide")) {
        document.getElementById("labelButton").click();
      }
      document.getElementById("bfButton").value = "Show NONE";
    }

    else if (bfButton.includes("NONE")) {
      if (document.getElementById("labelButton").value.includes("Hide")) {
        document.getElementById("labelButton").click();
      }
      bfNUMBER.setParameters({
        colorScheme: ""
      })
      bfDURATION.setParameters({
        colorScheme: ""
      })
      document.getElementById("bfButton").value = "Show DURATION map";
      document.getElementById("labelButton").disabled = true;
      document.getElementById("labelButton").style.opacity = 0;
      // document.getElementById("labelSlider").disabled = true;
      // document.getElementById("labelSlider").style.opacity = 0.5;

    }
  }
}, {
  // top: "46.0%",
  top: "31.5em",
  // left: "0.5%"
  left: "1em"
})
addElement(toggleBfactorButton)

// Button to toggle the visibility of the label representaion.
var toggleLabelButton = createElement("input", {
  id: "labelButton",
  type: "button",
  value: "Show Labels",
  onclick: function (e) {
    labelState = document.getElementById("labelButton").value.split(" ")[0].toUpperCase();
    var bfButton = document.getElementById("bfButton").value;
    // console.log(struc)

    // Ugly piece of code.
    if (labelState.includes("SHOW")) {

      var slider2 = document.getElementById("slider2")
      // console.log(stage.getRepresentationsByName("surface"))
      // console.log(bfMax)
      // slider2.max = 150;

      // var bfNumber = Array.from(labelNameNUMBER.parent.structure.atomStore.bfactor);
      // var bfMaxNumber = Math.max.apply(null, bfNumber);
      // var bfDuration = Array.from(labelNameDURATION.parent.structure.atomStore.bfactor);
      // var bfMaxDuration = Math.max.apply(null, bfDuration);
      // console.log(Math.max(bfMaxDuration, bfMaxNumber))


      // console.log(labelNameNUMBER.parent.structure.atomStore.bfactor)
      document.getElementById("labelButton").value = "Hide Labels"
      labelState = document.getElementById("labelButton").value.split(" ")[0].toUpperCase();

      if (bfButton.includes("NUMBER")) {
        var bfDuration = Array.from(labelNameDURATION.parent.structure.atomStore.bfactor);
        var bfMaxDuration = Math.max.apply(null, bfDuration);
        slider2.max = bfMaxDuration+0.1;

        // document.getElementById("bfButton").value = "toggle NUMBER";
        if (labelNameNUMBER.toggleVisibility().visible) {
          labelNameNUMBER.toggleVisibility();
        }
        if (!labelNameDURATION.toggleVisibility().visible) {
          labelNameDURATION.toggleVisibility();
        }
      } else if (bfButton.includes("NONE")) {
        var bfNumber = Array.from(labelNameNUMBER.parent.structure.atomStore.bfactor);
        var bfMaxNumber = Math.max.apply(null, bfNumber);
        slider2.max = bfMaxNumber+0.1;

        // document.getElementById("bfButton").value = "toggle DURATION";
        if (!labelNameNUMBER.toggleVisibility().visible) {
          labelNameNUMBER.toggleVisibility();
        }
        if (labelNameDURATION.toggleVisibility().visible) {
          labelNameDURATION.toggleVisibility();
        }
      } else if (bfButton.includes("DURATION")) {

        if (labelNameNUMBER.toggleVisibility().visible) {
          labelNameNUMBER.toggleVisibility();
        }
        if (labelNameDURATION.toggleVisibility().visible) {
          labelNameDURATION.toggleVisibility();
        }
      }

    } else if (labelState.includes("HIDE")) {
      document.getElementById("labelButton").value = "Show Labels"
      if (labelNameNUMBER.toggleVisibility().visible) {
        labelNameNUMBER.toggleVisibility();
      }
      if (labelNameDURATION.toggleVisibility().visible) {
        labelNameDURATION.toggleVisibility();
      }
    }
  }
}, {
  // top: "49.25%",
  top: "33.75em",
  left: "1em"
})
addElement(toggleLabelButton)

// Slider button to controll the position of the slice representation.
addElement(createElement("span", {
  innerText: "Slice Position: "
}, {
  // top: "39.1%",
  top: "28.2em",
  // left: "0.8%",
  left: "1.2em",
  color: "black",
  fontWeight: "bold"
}))
var slicePosition = createElement("input", {
  // class: "slider",
  id: "slider1",
  type: "range",
  min: 1,
  max: 100,
  step: 0.1,
  oninput: function (e) {
    stage.getRepresentationsByName("slice").setParameters({
      position: parseInt(e.target.value)
    })
  }
}, {
  // top: "42.0%",
  top: "30em",
  // left: "0.7%"
  left: "1.2em"
})
addElement(slicePosition)



// Slider button to controll the cutoff of the label representation.
addElement(createElement("span", {
  innerText: "Residue label cutoff:"
}, {
  // top: "52.5%",
  top: "35.8em",
  // left: "0.8%",
  left: "1.2em",
  color: "black",
  fontWeight: "bold"
}))
var lMax = 60.0
var labelPosition = createElement("input", {
  id: "slider2",
  type: "range",
  value: 10,
  min: 0,
  max: parseFloat(lMax),
  step: 0.1,
  oninput: function (e) {
    var labelUpdate = stage.getRepresentationsByName("label");
    // if (document.getElementById("bfButton").value.includes("DURATION")) {
    //   return
    // }
    labelUpdate = labelUpdate.list[parseInt(STATE)]
    stage.getRepresentationsByName("label").setParameters({
      showL: showLabel(labelUpdate, e.target.value)
    })
  }
}, {
  // top: "55.4%",
  top: "37.55em",
  // left: "0.7%"
  left: "1.2em"
})
addElement(labelPosition)

// Button to take a screenshot.
var screenshotButton = createElement("input", {
  id: "button5",
  type: "button",
  value: "Screenshot ",
  onclick: function () {
    stage.makeImage({
      factor: 1,
      antialias: false,
      trim: false,
      transparent: false
    }).then(function (blob) {
      NGL.download(blob, "screenshot.png")
    })
  }
}, {
  // top: "62.8%",
  top: "41.4em",
  left: "1em"
})
addElement(screenshotButton)

// Button to toggle the visibility of the TM helix annotations.
var annotationButton = createElement("input", {
  class: "slider",
  id: "annotation",
  type: "button",
  value: "Show TM Annotations",
  onclick: function () {

    // More elegant way but there's a weird delay with it.
    // var annotationState = strucNUMBER.annotationList[0].visible
    // if (annotationState) {
    //   strucNUMBER.eachAnnotation(a => { a.setVisibility(false) })
    //   document.getElementById("annotation").value = "Show TM Annotations"
    // } else {
    //   strucNUMBER.eachAnnotation(a => { a.setVisibility(true) })
    //   document.getElementById("annotation").value = "Hide TM Annotations"
    // }

    var an = document.getElementById("annotation").value
    // console.log(document.getElementById("annotation").value)

    hc = document.getElementsByTagName("div1");
    if (an.includes("Show")) {
      for (var i = 0; i < hc.length; i++) {
        hc[i].hidden = false;
        document.getElementById("annotation").value = "Hide TM Annotations"
      }
    } else if (an.includes("Hide")) {
      for (var i = 0; i < hc.length; i++) {
        hc[i].hidden = true;
        document.getElementById("annotation").value = "Show TM Annotations"
      }
    }

  }
}, {
  // top: "59.5%",
  top: "39.1em",
  left: "1em"
})
addElement(annotationButton)

// Button to controll the scrolling behaviour of the
// lipid density representation.
var scrollSelect = createSelect([
  ["PIPs", "shift+scroll PIPs"],
  ["CHOL", "shift+scroll Chol"],
  ["both", "shift+scroll both"]
], {
  onchange: function (e) {
    var v = e.target.value
    if (v === "PIPs") {
      scrollPIPs = true
      scrollCHOL = false
    } else if (v === "CHOL") {
      scrollPIPs = false
      scrollCHOL = true
    } else if (v === "both") {
      scrollPIPs = true
      scrollCHOL = true
    }
  }
}, {
  // top: "18.3%",
  top: "14.3em",
  // left: "0.5%"
  left: "1em"
})
addElement(scrollSelect)

// Text to indicate the PIP isolovel density.
var isolevelPIPsText = createElement(
  "span", {}, {
    // bottom: "32px",
    bottom: "2.3em",
    // top: "66.2em",
    // left: "12px",
    left: "1em",
    color: "black"
  }
)
addElement(isolevelPIPsText)

// Text to indicate the cholesterol isolevel density.
var isolevelCHOLText = createElement(
  "span", {}, {
    // bottom: "12px",
    bottom: "1em",
    // top: "67.5em",
    // left: "12px",
    left: "1em",
    color: "black"
  }
)
addElement(isolevelCHOLText)

// Add the text "GPCR structure:" to the screen. That's it.
var gpcrStructureText = createElement("span", {
  innerText: "GPCR structure:"
}, {
  // bottom: "32px",
  bottom: "2.3em",
  // top: "66.2em",
  // right: "12px",
  right: "1em",
  color: "black"
})
addElement(gpcrStructureText)

// Text position for the name of each GPCR. The names are defined
// when the structure is loaded.
var gpcrNameText = createElement("span", {
  innerText: ""
}, {
  // bottom: "12px",
  bottom: "1em",
  // top: "67.5em",
  // right: "12px",
  right: "1em",
  color: "black"
})
addElement(gpcrNameText)

// Add the ctrl+scroll mouse behaviour to controll the density isolevels.
stage.mouseControls.add("scroll-shift", function () {
  if (surfPIPs) {
    var levelPIPs = surfPIPs.getParameters().isolevel.toFixed(1)
    isolevelPIPsText.innerText = "PIPs density level: " + levelPIPs// + "\u03C3"
  }
  if (surfCHOL) {
    var levelCHOL = surfCHOL.getParameters().isolevel.toFixed(2)
    isolevelCHOLText.innerText = "Chol level: " + levelCHOL //+ "\u03C3"
  }
})

// The function to load each GPCR. There's almost definitely a more efficient way of doing this,
// but this is what I have for now.
// The order in which these files are loaded matters and it affects quite a few things in the code
// if the order is changed (or another file is added).
function loadGPCR(id) {
  // Probably not a good idea to impose this level of quality.
  stage.setParameters({
    quality: "auto"
  })

  // console.log(stage.getParameters())
  var pl
  if (id === "5HT1B") {
    p1 = [
      loadStructure("data/bf/5HT1B_vmd_NUMBER.pdb"),
      loadStructure("data/bf/5HT1B_vmd_DURATION.pdb", "Serotonin Receptor 5-HT1B", "4IAQ"),
      loadPIPs("data/dxs/5HT1B_pips.dx"),
      loadCHOL("data/dxs/5HT1B_roh.dx"),
      stage.viewerControls.orient([-120.39, -11.75, 3.76, 0, 2.60, 11.99, 120.40, 0, -12.07, 119.84, -11.68, 0, -90.65, -97.35, -62.85, 1]),
    ]
  } else if (id === "A2ARa") {
    pl = [
      loadStructure("data/bf/A2ARa_vmd_NUMBER.pdb"),
      loadStructure("data/bf/A2ARa_vmd_DURATION.pdb", "Adenosine A2A Receptor (active state)", "2YDV"),
      loadPIPs("data/dxs/A2ARa_pips.dx"),
      loadCHOL("data/dxs/A2ARa_roh.dx"),
      stage.viewerControls.orient([-101.36, 4.60, -54.80, 0, -54.94, -3.53, 101.33, 0, 2.37, 115.20, 5.30, 0, -96.55, -89.45, -63.85, 1]),
    ]
  } else if (id === "A2ARi") {
    pl = [
      loadStructure("data/bf/A2ARi_vmd_NUMBER.pdb"),
      loadStructure("data/bf/A2ARi_vmd_DURATION.pdb", "Adenosine A2A Receptor (inactive state)", "3EML"),
      loadPIPs("data/dxs/A2ARi_pips.dx"),
      loadCHOL("data/dxs/A2ARi_roh.dx"),
      stage.viewerControls.orient([-101.36, 4.60, -54.80, 0, -54.94, -3.53, 101.33, 0, 2.37, 115.20, 5.30, 0, -96.55, -89.45, -63.85, 1]),
    ]
  } else if (id === "ApelinR") {
    pl = [
      loadStructure("data/bf/ApelinR_vmd_NUMBER.pdb"),
      loadStructure("data/bf/ApelinR_vmd_DURATION.pdb", "Apelin Receptor", "4VBL"),
      loadPIPs("data/dxs/ApelinR_pips.dx"),
      loadCHOL("data/dxs/ApelinR_roh.dx"),
      stage.viewerControls.orient([-101.36, 4.60, -54.80, 0, -54.94, -3.53, 101.33, 0, 2.37, 115.20, 5.30, 0, -96.55, -89.45, -63.85, 1]),
    ]
  } else if (id === "AT2R") {
    pl = [
      loadStructure("data/bf/AT2R_vmd_NUMBER.pdb"),
      loadStructure("data/bf/AT2R_vmd_DURATION.pdb", "Angiotensin II Type 2 Receptor", "5UNG"),
      loadPIPs("data/dxs/AT2R_pips.dx"),
      loadCHOL("data/dxs/AT2R_roh.dx"),
      stage.viewerControls.orient([-116.74, -1.55, 27.90, 0, 27.27, 19.83, 115.20, 0, -6.096, 118.38, -18.93, 0, -91.90, -91.70, -65.45, 1]),
    ]
  } else if (id === "b2ARa") {
    pl = [
      loadStructure("data/bf/b2ARa_vmd_NUMBER.pdb"),
      loadStructure("data/bf/b2ARa_vmd_DURATION.pdb", "β2 Adrenergic Receptor (active state)", "3SN6"),
      loadPIPs("data/dxs/b2ARa_pips.dx"),
      loadCHOL("data/dxs/b2ARa_roh.dx"),
      stage.viewerControls.orient([-101.36, 4.60, -54.80, 0, -54.94, -3.53, 101.33, 0, 2.37, 115.20, 5.30, 0, -96.55, -89.45, -63.85, 1]),
    ]
  } else if (id === "b2ARi") {
    pl = [
      loadStructure("data/bf/b2ARi_vmd_NUMBER.pdb"),
      loadStructure("data/bf/b2ARi_vmd_DURATION.pdb", "β2 Adrenergic Receptor (inactive state)", "2RH1"),
      loadPIPs("data/dxs/b2ARi_pips.dx"),
      loadCHOL("data/dxs/b2ARi_roh.dx"),
      stage.viewerControls.orient([-101.36, 4.60, -54.80, 0, -54.94, -3.53, 101.33, 0, 2.37, 115.20, 5.30, 0, -96.55, -89.45, -63.85, 1]),
    ]
  } else if (id === "CalcitoninR") {
    pl = [
      loadStructure("data/bf/CalcitoninR_vmd_NUMBER.pdb"),
      loadStructure("data/bf/CalcitoninR_vmd_DURATION.pdb", "Calcitonin Receptor", "5UZ7"),
      loadPIPs("data/dxs/CalcitoninR_pips.dx"),
      loadCHOL("data/dxs/CalcitoninR_roh.dx"),
      stage.viewerControls.orient([-101.36, 4.60, -54.80, 0, -54.94, -3.53, 101.33, 0, 2.37, 115.20, 5.30, 0, -96.55, -89.45, -63.85, 1]),
    ]
  } else if (id === "CB1R") {
    pl = [
      loadStructure("data/bf/CB1R_vmd_NUMBER.pdb"),
      loadStructure("data/bf/CB1R_vmd_DURATION.pdb", "Cannabinoid Receptor CB1", "5TGZ"),
      loadPIPs("data/dxs/CB1R_pips.dx"),
      loadCHOL("data/dxs/CB1R_roh.dx"),
      stage.viewerControls.orient([-101.36, 4.60, -54.80, 0, -54.94, -3.53, 101.33, 0, 2.37, 115.20, 5.30, 0, -96.55, -89.45, -63.85, 1]),
    ]
  } else if (id === "CXCR1") {
    pl = [
      loadStructure("data/bf/CXCR1_vmd_NUMBER.pdb"),
      loadStructure("data/bf/CXCR1_vmd_DURATION.pdb", "C-X-C Motif Chemokine Receptor 1", "2LNL"),
      loadPIPs("data/dxs/CXCR1_pips.dx"),
      loadCHOL("data/dxs/CXCR1_roh.dx"),
      stage.viewerControls.orient([3.63, 0.53, 113.63, 0, 112.01, -19.13, -3.49, 0, 19.11, 112.06, -1.13, 0, -92.90, -90.85, -63.5, 1]),
    ]
  } else if (id === "D3R") {
    pl = [
      loadStructure("data/bf/D3R_vmd_NUMBER.pdb"),
      loadStructure("data/bf/D3R_vmd_DURATION.pdb", "Dopamine D3 Receptor", "3PBL"),
      loadPIPs("data/dxs/D3R_pips.dx"),
      loadCHOL("data/dxs/D3R_roh.dx"),
      stage.viewerControls.orient([-101.36, 4.60, -54.80, 0, -54.94, -3.53, 101.33, 0, 2.37, 115.20, 5.30, 0, -96.55, -89.45, -63.85, 1]),
    ]
  } else if (id === "ETbR") {
    pl = [
      loadStructure("data/bf/ETbR_vmd_NUMBER.pdb"),
      loadStructure("data/bf/ETbR_vmd_DURATION.pdb", "Endothelin ETB Receptor", "5X93"),
      loadPIPs("data/dxs/ETbR_pips.dx"),
      loadCHOL("data/dxs/ETbR_roh.dx"),
      stage.viewerControls.orient([-101.36, 4.60, -54.80, 0, -54.94, -3.53, 101.33, 0, 2.37, 115.20, 5.30, 0, -96.55, -89.45, -63.85, 1]),
    ]
  } else if (id === "GLP1") {
    pl = [
      loadStructure("data/bf/GLP1_vmd_NUMBER.pdb"),
      loadStructure("data/bf/GLP1_vmd_DURATION.pdb", "Glucagon-Like Peptide 1", "5VEW"),
      loadPIPs("data/dxs/GLP1_pips.dx"),
      loadCHOL("data/dxs/GLP1_roh.dx"),
      stage.viewerControls.orient([-101.36, 4.60, -54.80, 0, -54.94, -3.53, 101.33, 0, 2.37, 115.20, 5.30, 0, -96.55, -89.45, -63.85, 1]),
    ]
  } else if (id === "GlucagonR") {
    pl = [
      loadStructure("data/bf/GlucagonR_vmd_NUMBER.pdb"),
      loadStructure("data/bf/GlucagonR_vmd_DURATION.pdb", "Glucagon Receptor", "4L6R"),
      loadPIPs("data/dxs/GlucagonR_pips.dx"),
      loadCHOL("data/dxs/GlucagonR_roh.dx"),
      stage.viewerControls.orient([-101.36, 4.60, -54.80, 0, -54.94, -3.53, 101.33, 0, 2.37, 115.20, 5.30, 0, -96.55, -89.45, -63.85, 1]),
    ]
  } else if (id === "H1R") {
    pl = [
      loadStructure("data/bf/H1R_vmd_NUMBER.pdb"),
      loadStructure("data/bf/H1R_vmd_DURATION.pdb", "Histamine Receptor H1", "3RZE"),
      loadPIPs("data/dxs/H1R_pips.dx"),
      loadCHOL("data/dxs/H1R_roh.dx"),
      stage.viewerControls.orient([-101.36, 4.60, -54.80, 0, -54.94, -3.53, 101.33, 0, 2.37, 115.20, 5.30, 0, -96.55, -89.45, -63.85, 1]),
    ]
  } else if (id === "LPAR1") {
    pl = [
      loadStructure("data/bf/LPAR1_vmd_NUMBER.pdb"),
      loadStructure("data/bf/LPAR1_vmd_DURATION.pdb", "Lysophosphatidic Acid Receptor 1", "4Z36"),
      loadPIPs("data/dxs/LPAR1_pips.dx"),
      loadCHOL("data/dxs/LPAR1_roh.dx"),
      stage.viewerControls.orient([-101.36, 4.60, -54.80, 0, -54.94, -3.53, 101.33, 0, 2.37, 115.20, 5.30, 0, -96.55, -89.45, -63.85, 1]),
    ]
  } else if (id === "M2Ra") {
    pl = [
      loadStructure("data/bf/M2Ra_vmd_NUMBER.pdb"),
      loadStructure("data/bf/M2Ra_vmd_DURATION.pdb", "Muscarinic Receptor (active state)", "4MQS"),
      loadPIPs("data/dxs/M2Ra_pips.dx"),
      loadCHOL("data/dxs/M2Ra_roh.dx"),
      stage.viewerControls.orient([-101.36, 4.60, -54.80, 0, -54.94, -3.53, 101.33, 0, 2.37, 115.20, 5.30, 0, -96.55, -89.45, -63.85, 1]),
    ]
  } else if (id === "M2Ri") {
    pl = [
      loadStructure("data/bf/M2Ri_vmd_NUMBER.pdb"),
      loadStructure("data/bf/M2Ri_vmd_DURATION.pdb", "Muscarinic Receptor (inactive state)", "3UON"),
      loadPIPs("data/dxs/M2Ri_pips.dx"),
      loadCHOL("data/dxs/M2Ri_roh.dx"),
      stage.viewerControls.orient([-101.36, 4.60, -54.80, 0, -54.94, -3.53, 101.33, 0, 2.37, 115.20, 5.30, 0, -96.55, -89.45, -63.85, 1]),
    ]
  } else if (id === "mGlu5") {
    pl = [
      loadStructure("data/bf/mGlu5_vmd_NUMBER.pdb"),
      loadStructure("data/bf/mGlu5_vmd_DURATION.pdb", "Metabotropic Glutamate Receptor 5", "4OO9"),
      loadPIPs("data/dxs/mGlu5_pips.dx"),
      loadCHOL("data/dxs/mGlu5_roh.dx"),
      stage.viewerControls.orient([-101.36, 4.60, -54.80, 0, -54.94, -3.53, 101.33, 0, 2.37, 115.20, 5.30, 0, -96.55, -89.45, -63.85, 1]),
    ]
  } else if (id === "mORa") {
    pl = [
      loadStructure("data/bf/mORa_vmd_NUMBER.pdb"),
      loadStructure("data/bf/mORa_vmd_DURATION.pdb", "μ-Opioid Receptor (active state)", "5C1M"),
      loadPIPs("data/dxs/mORa_pips.dx"),
      loadCHOL("data/dxs/mORa_roh.dx"),
      stage.viewerControls.orient([-101.36, 4.60, -54.80, 0, -54.94, -3.53, 101.33, 0, 2.37, 115.20, 5.30, 0, -96.55, -89.45, -63.85, 1]),
    ]
  } else if (id === "mORi") {
    pl = [
      loadStructure("data/bf/mORi_vmd_NUMBER.pdb"),
      loadStructure("data/bf/mORi_vmd_DURATION.pdb", "μ-Opioid Receptor (inactive state)", "4DKL"),
      loadPIPs("data/dxs/mORi_pips.dx"),
      loadCHOL("data/dxs/mORi_roh.dx"),
      stage.viewerControls.orient([-101.36, 4.60, -54.80, 0, -54.94, -3.53, 101.33, 0, 2.37, 115.20, 5.30, 0, -96.55, -89.45, -63.85, 1]),
    ]
  } else if (id === "OX2R") {
    pl = [
      loadStructure("data/bf/OX2R_vmd_NUMBER.pdb"),
      loadStructure("data/bf/OX2R_vmd_DURATION.pdb", "Orexin 2 Receptor", "5WQC"),
      loadPIPs("data/dxs/OX2R_pips.dx"),
      loadCHOL("data/dxs/OX2R_roh.dx"),
      stage.viewerControls.orient([-101.36, 4.60, -54.80, 0, -54.94, -3.53, 101.33, 0, 2.37, 115.20, 5.30, 0, -96.55, -89.45, -63.85, 1]),
    ]
  } else if (id === "PAR2") {
    pl = [
      loadStructure("data/bf/PAR2_vmd_NUMBER.pdb"),
      loadStructure("data/bf/PAR2_vmd_DURATION.pdb", "Protease-Activated Receptor 2", "5NDD"),
      loadPIPs("data/dxs/PAR2_pips.dx"),
      loadCHOL("data/dxs/PAR2_roh.dx"),
      stage.viewerControls.orient([-101.36, 4.60, -54.80, 0, -54.94, -3.53, 101.33, 0, 2.37, 115.20, 5.30, 0, -96.55, -89.45, -63.85, 1]),
    ]
  } else if (id === "RhodRa") {
    pl = [
      loadStructure("data/bf/RhodRa_vmd_NUMBER.pdb"),
      loadStructure("data/bf/RhodRa_vmd_DURATION.pdb", "Rhodopsin (active state)", "3PQR"),
      loadPIPs("data/dxs/RhodRa_pips.dx"),
      loadCHOL("data/dxs/RhodRa_roh.dx"),
      stage.viewerControls.orient([-120.39, -11.75, 3.76, 0, 2.60, 11.99, 120.40, 0, -12.07, 119.84, -11.68, 0, -90.65, -97.35, -62.85, 1]),
    ]
  } else if (id === "RhodRi") {
    pl = [
      loadStructure("data/bf/RhodRi_vmd_NUMBER.pdb"),
      loadStructure("data/bf/RhodRi_vmd_DURATION.pdb", "Rhodopsin (inactive state)", "1GZM"),
      loadPIPs("data/dxs/RhodRi_pips.dx"),
      loadCHOL("data/dxs/RhodRi_roh.dx"),
      stage.viewerControls.orient([-64.31, -2.42, 102.66, 0, 102.46, 6.44, 64.34, 0, -6.74, 120.96, -1.37, 0, -91.40, -93.05, -66.95, 1]),
    ]
  } else if (id === "S1PR1") {
    pl = [
      loadStructure("data/bf/S1PR1_vmd_NUMBER.pdb"),
      loadStructure("data/bf/S1PR1_vmd_DURATION.pdb", "Lysophospholipid Sphingosine 1-Phosphate", "3V2Y"),
      loadPIPs("data/dxs/S1PR1_pips.dx"),
      loadCHOL("data/dxs/S1PR1_roh.dx"),
      stage.viewerControls.orient([-101.36, 4.60, -54.80, 0, -54.94, -3.53, 101.33, 0, 2.37, 115.20, 5.30, 0, -96.55, -89.45, -63.85, 1]),
    ]
  } else if (id === "SMO") {
    pl = [
      loadStructure("data/bf/SMO_vmd_NUMBER.pdb"),
      loadStructure("data/bf/SMO_vmd_DURATION.pdb", "Smoothened Receptor", "4N4W"),
      loadPIPs("data/dxs/SMO_pips.dx"),
      loadCHOL("data/dxs/SMO_roh.dx"),
      stage.viewerControls.orient([-101.36, 4.60, -54.80, 0, -54.94, -3.53, 101.33, 0, 2.37, 115.20, 5.30, 0, -96.55, -89.45, -63.85, 1]),
    ]
  } else if (id === "US28") {
    pl = [
      loadStructure("data/bf/US28_vmd_NUMBER.pdb"),
      loadStructure("data/bf/US28_vmd_DURATION.pdb", "US28", "4XT1"),
      loadPIPs("data/dxs/US28_pips.dx"),
      loadCHOL("data/dxs/US28_roh.dx"),
      stage.viewerControls.orient([-101.36, 4.60, -54.80, 0, -54.94, -3.53, 101.33, 0, 2.37, 115.20, 5.30, 0, -96.55, -89.45, -63.85, 1]),
    ]
  }
}

// The default GPCR to load.
loadGPCR("RhodRa");

var slider = document.getElementById("slider1");
var slider2 = document.getElementById("slider2");
var annot = document.getElementById("annotation");
var button1 = document.getElementById("button1");
var button2 = document.getElementById("button2");
var button3 = document.getElementById("button3");
var button4 = document.getElementById("button4");
var button5 = document.getElementById("button5");
var bfButtonCss = document.getElementById("bfButton");
var labelButtonCss = document.getElementById("labelButton");
var GPCRselect = document.getElementsByTagName("select")[0]
GPCRselect.id = "soflow-color"

var GPCRselect = document.getElementsByTagName("select")[1]
GPCRselect.id = "soflow-color2"

var GPCRselect = document.getElementsByTagName("select")[1]
GPCRselect.id = "soflow-color4"

var GPCRselect = document.getElementsByTagName("select")[2]
GPCRselect.id = "soflow-color2"

var GPCRselect = document.getElementsByTagName("select")[3]
GPCRselect.id = "soflow-color3"

slider.classList.add("slider");
slider2.classList.add("slider");
annot.classList.add("primary-btn");
button1.classList.add("primary-btn");
button2.classList.add("primary-btn");
button3.classList.add("primary-btn");
button4.classList.add("primary-btn");
button5.classList.add("primary-btn");
bfButtonCss.classList.add("primary-btn");
labelButtonCss.classList.add("primary-btn");


document.getElementById("labelButton").disabled = true;
document.getElementById("labelButton").style.opacity = 0;

});
