let scrollFrames = {
    defaults: {
        backgroundSize: 'cover', // String, CSS value of 'background-size' property
        enabled: true // boolean - Sets the status of animation interval
    },
    // Scroll line
    // @el - object - The DOM object to detect
    // Returns float between 0 and 1
    // value == 0 means the element is not visible yet
    // value between 0 and 1 means the element is currently visible into the viewport
    // 0 means the element starts into the viewport
    // 1 means the element has just finished to run through the viewport
    // value == 1 means the element has past the viewport is not visible anymore
    getScrollLine: function(el) {
        let response = -1;
        if (typeof el == 'object') {
            const detector_id = el.getAttribute('scroll-frames-detector');
            if (detector_id !== null) {
                const el_detector = document.getElementById(detector_id);
                if (el_detector !== null) {
                    el = el_detector;
                }
            }
            if (typeof el.getBoundingClientRect == 'function') {
                const box = el.getBoundingClientRect();
                const el_offset_top = box.top + window.pageYOffset - document.documentElement.clientTop;
                const el_height = el.clientHeight;
                const window_scroll_top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
                const window_height = window.document.documentElement.clientHeight;
                response = (window_scroll_top + window_height - el_offset_top) / (window_height + el_height);
            }
        }
        // Limits between 0 and 1
        // if (response > 1) {
        //     response = 1;
        // }
        // if (response < 0) {
        //     response = 0;
        // }
        return response;
    },
    anims: {},
    // Set up the animations
    update: function() {
        // Scan for instances
        let elems_anims = document.querySelectorAll('[scroll-frames]');
        if (elems_anims !== null) {
            elems_anims.forEach(function(el_anim) {
                // Get the anim ID
                const anim_id = el_anim.getAttribute('scroll-frames');
                // Get the JSON URL
                const anim_json_url = el_anim.dataset.json;
                // Get the anim timeline
                let anim_timeline = el_anim.dataset.timeline;
                // Set default timeline if unset
                if (anim_timeline === undefined) {
                    anim_timeline = '0:0 to 100:100';
                }
                // Test if valid JSON URL
                if (anim_json_url.indexOf('.json') == anim_json_url.length - 5) {
                    // Check id validity
                    if (anim_id.length > 0 && anim_id !== undefined) {
                        // Init instance before fetch
                        scrollFrames.anims[anim_id] = {
                            enabled: false,
                            transfer: false,
                            backgroundImage: '',
                            backgroundSizes: [],
                            init: false
                        }
                        // Let's fetch
                        fetch(anim_json_url).then(function(response) {
                            const contentType = response.headers.get("content-type");
                            if(contentType && contentType.indexOf("application/json") !== -1) {
                                return response.json().then(function(json) {
                                    // Background image string and background size object
                                    let backgroundImage = '';
                                    let backgroundSizes = [];
                                    // console.log(json);
                                    json.forEach(function(data, index) {
                                        backgroundImage += 'url('+data.url+')';
                                        if (index < json.length - 1) {
                                            backgroundImage += ',';
                                        }
                                        let backgroundSize = '';
                                        json.forEach(function(bsData, bsIndex) {
                                            if (bsIndex == index) {
                                                backgroundSize += scrollFrames.defaults.backgroundSize;
                                            } else {
                                                backgroundSize += '0%';
                                            }
                                            if (bsIndex < json.length - 1) {
                                                backgroundSize += ',';
                                            }
                                        });
                                        backgroundSizes.push(backgroundSize);
                                    });
                                    // Write the CSS multiple background-image property for this anim
                                    scrollFrames['anims'][anim_id]['backgroundImage'] = backgroundImage;
                                    // Write the CSS multiple background-size property for this anim
                                    scrollFrames['anims'][anim_id]['backgroundSizes'] = backgroundSizes;
                                    // Build the transfer function from timeline
                                    scrollFrames['anims'][anim_id]['transfer'] = function(scroll_line) {
                                        let response = 0;
                                        if (typeof scroll_line == 'number') {
                                            // Keypoints
                                            if (anim_timeline.indexOf(':') > 0) {
                                                // example: 0:0 to 70:0 to 100:100
                                                // console.log(anim_id);
                                                const fromToArray = anim_timeline.split(' to ');
                                                let xa = 0;
                                                let ya = fromToArray[0].split(':')[1];
                                                let xb = 1;
                                                let yb = 1;
                                                // console.log(fromToArray);
                                                fromToArray.forEach(function(keypoint, keyPointIndex) {
                                                    // If not last
                                                    if (keyPointIndex < fromToArray.length - 1) {
                                                        const positionCurrent = parseFloat(keypoint.split(':')[0]) / 100;
                                                        const positionNext = parseFloat(fromToArray[keyPointIndex + 1].split(':')[0]) / 100;
                                                        
                                                        if (scroll_line >= positionCurrent && scroll_line <= positionNext) {
                                                            // console.log(positionCurrent, scroll_line, positionNext);
                                                            xa = positionCurrent;
                                                            ya = parseFloat(keypoint.split(':')[1]);
                                                            xb = positionNext;
                                                            yb = parseFloat(fromToArray[keyPointIndex + 1].split(':')[1]);
                                                        }
                                                    }
                                                });
                                                const coef = (yb - ya) / (xb - xa);
                                                const y0 = yb - coef * xb;
                                                response = (coef * scroll_line + y0) / 100;
                                                // console.log(anim_id, response);
                                                // console.log('scroll_line:'+scroll_line, 'yb:'+yb, 'ya:'+ya, 'xb:'+xb, 'xa:'+xa, 'response:'+response);
                                            }
                                        }
                                        return response;
                                    }
                                    // Write it is OK enabled to be used
                                    scrollFrames['anims'][anim_id]['enabled'] = scrollFrames.defaults.enabled;
                                    // Write the DOM element
                                    scrollFrames['anims'][anim_id]['el'] = el_anim;
                                    // If optional detector is set
                                    if (scrollFrames['anims'][anim_id]['el'] !== null) {
                                        const optional_detector_id = scrollFrames['anims'][anim_id]['el'].getAttribute('scroll-frames-detector');
                                        const el_detector = document.getElementById(optional_detector_id);
                                        if (el_detector !== null) {
                                            scrollFrames['anims'][anim_id]['el_detector'] = el_detector;
                                        }
                                    }
                                    
                                    // Apply the background-image property on element
                                    // Comment for lazy loading
                                    el_anim.style.backgroundImage = scrollFrames['anims'][anim_id]['backgroundImage'];
                                    // Start 
                                    scrollFrames.frame();
                                    // Apply listener
                                    window.addEventListener('scroll', scrollFrames.frame);
                                });
                            } else {
                                console.log(anim_json_url+" is not a valid JSON URL!");
                            }
                        });
                    }
                }
            });
        }
    },
    frame: function() {
        // Scan all anims ids
        Object.keys(scrollFrames.anims).forEach(function(anim_id, anim_index) {
            // Anim must exist
            if (scrollFrames['anims'][anim_id] !== null) {
                // If current anim is enabled
                if (scrollFrames['anims'][anim_id]['enabled'] && scrollFrames['anims'][anim_id]['el'] !== null) {
                    let current_scroll_line = 0;
                    if (scrollFrames['anims'][anim_id]['el_detector'] !== null && scrollFrames['anims'][anim_id]['el_detector'] !== undefined) {
                        current_scroll_line = scrollFrames.getScrollLine(scrollFrames['anims'][anim_id]['el_detector']);
                    } else {
                        current_scroll_line = scrollFrames.getScrollLine(scrollFrames['anims'][anim_id]['el']);
                    }
                    // Uncomment for lazy loading
                    // if (current_scroll_line >= -2 && current_scroll_line <= 1) {
                    //     if (!scrollFrames['anims'][anim_id]['init']) {
                    //         scrollFrames['anims'][anim_id]['el']['style']['background-image']  = scrollFrames['anims'][anim_id]['backgroundImage'];
                    //         scrollFrames['anims'][anim_id]['init'] = true;
                    //     }
                    // }
                    let frameIndex = scrollFrames['anims'][anim_id]['transfer'](current_scroll_line);
                    if (current_scroll_line < 0) {
                        frameIndex = 0;
                    }
                    if (current_scroll_line > 1) {
                        frameIndex = 1;
                    }
                    const index = Math.round(frameIndex * (scrollFrames['anims'][anim_id]['backgroundSizes'].length - 1));
                    // console.log(anim_id, current_scroll_line, frameIndex);
                    // Apply proper background-size property
                    scrollFrames['anims'][anim_id]['el']['style']['background-size'] = scrollFrames['anims'][anim_id]['backgroundSizes'][index];
                }
            }
        });
    },
    // Start animation on scroll
    // @id - string - Optional - id of the anim
    //      If @id is set, starts the specified anim
    //      If no @id is set, starts all anims
    start: function(id) {
        if (typeof id == 'string') {
            if (scrollFrames.anims[id] !== undefined) {
                scrollFrames.anims[id]['enabled'] = true;
            }
        }
        if (id === undefined) {
            for (const anim_id in scrollFrames.anims) {
                if (Object.hasOwnProperty.call(scrollFrames.anims, anim_id)) {
                    scrollFrames.anims[anim_id]['enabled'] = true;
                }
            }
        }
    },
    // Stop / Pause animation on scroll
    // @id - string - Optional - id of the anim
    //      If @id is set, stops the specified anim
    //      If no @id is set, stops all anims
    stop: function(id) {
        if (typeof id == 'string') {
            if (scrollFrames.anims[id] !== undefined) {
                scrollFrames.anims[id]['enabled'] = false;
            }
        }
        if (id === undefined) {
            for (const anim_id in scrollFrames.anims) {
                if (Object.hasOwnProperty.call(scrollFrames.anims, anim_id)) {
                    scrollFrames.anims[anim_id]['enabled'] = false;
                }
            }
        }
    },
    // Destroy 
    // @id - string - Optional - id of the anim to destroy
    //      If @id is set, destroys the specified anim
    //      If no @id is set, destroys all anims
    destroy: function(id) {
        if (typeof id == 'string') {
            if (scrollFrames.anims[id] !== undefined) {
                scrollFrames.anims[id] = null;
            }
        }
        if (id === undefined) {
            for (const anim_id in scrollFrames.anims) {
                if (Object.hasOwnProperty.call(scrollFrames.anims, anim_id)) {
                    scrollFrames.anims[anim_id] = null;
                }
            }
        }
    }
}
scrollFrames.update();



// POC
// let el = document.getElementById('test');
// // With fetch
// fetch('../js/fakedata/frames.json').then(function(response) {
//     var contentType = response.headers.get("content-type");
//     if(contentType && contentType.indexOf("application/json") !== -1) {
//         return response.json().then(function(json) {
//             // traitement du JSON
//             // Background image string and background size object
//             let backgroundImage = '';
//             let backgroundSizes = [];
//             json.frames.forEach(function(url, index) {
//                 backgroundImage += 'url('+url.url+')';
//                 if (index < json.frames.length - 1) {
//                     backgroundImage += ',';
//                 }
//                 let backgroundSize = '';
//                 json.frames.forEach(function(url, bsIndex) {
//                     if (bsIndex == index) {
//                         backgroundSize += 'cover';
//                     } else {
//                         backgroundSize += '0%';
//                     }
//                     if (bsIndex < json.frames.length - 1) {
//                         backgroundSize += ',';
//                     }
//                 });
//                 backgroundSizes.push(backgroundSize);
//             });
//             el.style.backgroundImage = backgroundImage;
//             // console.log(backgroundSizes);

//             // Scroll
//             let window_scroll_top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
//             const window_height = window.document.documentElement.clientHeight;
//             const body = document.body;
//             const html = document.documentElement;
//             const document_height = Math.max(
//                 body.offsetHeight,
//                 body.scrollHeight,
//                 html.clientHeight,
//                 html.offsetHeight,
//                 html.scrollHeight
//             );
//             let index = 0, previousIndex = 0;
//             let frame = function() {
//                 window_scroll_top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
//                 //index = window_scroll_top / (document_height - window_height);
//                 index = Math.round((window_scroll_top / (document_height - window_height)) * (backgroundSizes.length - 1));
                
//                 if (previousIndex !== index) {
//                     // console.log(index);
//                 }
//                 previousIndex = index;
//                 // for (const property in actual_JSON['frames'][index]) {
//                 //     if (Object.hasOwnProperty.call(actual_JSON['frames'][index], property)) {
//                 //         el.style[property] = actual_JSON['frames'][index][property];
//                 //     }
//                 // }
//                 // el.style.backgroundImage = 'url('+actual_JSON['frames'][index]+')';
//                 el.style.backgroundSize = backgroundSizes[index];

//             };
//             window.addEventListener('scroll', frame);
//         });
//     } else {
//         console.log("Oops, nous n'avons pas du JSON!");
//     }
// });


// JSON with XHR
// let xobj = new XMLHttpRequest();
//     xobj.overrideMimeType("application/json");
// xobj.open('GET', '../js/fakedata/frames.json', true); // Replace 'my_data' with the path to your file
// xobj.onenabledstatechange = function () {
//     if (xobj.enabledState == 4 && xobj.status == "200") {
//         // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
        
//     }
// };
// xobj.send(null);

