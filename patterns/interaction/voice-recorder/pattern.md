---
id: voice-recorder
title: Voice Message Recorder
category: interaction
order: 29
---
## Rule
<p>A hold-to-record voice button makes five decisions, and each one gives the gesture a visible way out. <strong>Press:</strong> the timer starts and the button swells out past the thumb in the same frame as the press, before the first word, so the person can see it is recording; feedback hidden under the thumb leaves them asking whether it heard them. <strong>Cancel:</strong> sliding left past a fixed line turns the hint into a trash can, so releasing before the line sends and releasing past it deletes. <strong>Lock:</strong> for a long message, sliding up locks the recording and frees the thumb; a stop button and a send button replace the gesture, so nothing ends by accident.</p>
<p><strong>Mic check:</strong> a live input waveform moves with the voice, and a flat line for 2 seconds raises a banner (No sound for 2 seconds. Your mic looks muted.) with an Unmute button, before a whole minute is wasted. <strong>Playback:</strong> the listener&rsquo;s bubble shows the length as a scrubbable waveform, with a draggable playhead, timestamps as jump points, a 1x to 1.5x speed toggle, and the time shown as time left, counting down.</p>
## Do
- Timer and swell visible past the thumb on press, before any sound
- A fixed cancel line: past it, release deletes
- Slide up to lock long messages, then explicit stop and send
- A flat waveform for 2 seconds raises a muted-mic warning with Unmute
## Avoid
- Recording feedback hidden under the thumb
- A long recording that ends the moment the thumb slips
## Code: JS
<pre><code><span class="cm">// hold to record, slide left to cancel, slide up to lock</span>
<span class="kw">const</span> CANCEL_X = -<span class="num">120</span>; <span class="cm">// px left of the start point: past it, release deletes</span>
<span class="kw">const</span> LOCK_Y = -<span class="num">80</span>;    <span class="cm">// px above the start point: past it, recording locks</span>
mic.addEventListener(<span class="str">'pointerdown'</span>, e =&gt; {
  start = { x: e.clientX, y: e.clientY }; recorder.start();
  ui.showTimerAndSwell(); <span class="cm">// same frame as the press, before any sound</span>
});
mic.addEventListener(<span class="str">'pointermove'</span>, e =&gt; {
  ui.setCancelHint(e.clientX - start.x &lt; CANCEL_X ? <span class="str">'trash'</span> : <span class="str">'slide'</span>);
  <span class="kw">if</span> (e.clientY - start.y &lt; LOCK_Y) { locked = <span class="kw">true</span>; ui.showStopAndSend(); }
});
mic.addEventListener(<span class="str">'pointerup'</span>, e =&gt; {
  <span class="kw">if</span> (locked) <span class="kw">return</span>; <span class="cm">// only the stop or send button ends a locked recording</span>
  (e.clientX - start.x &lt; CANCEL_X) ? recorder.discard() : recorder.send();
});
<span class="cm">// mic check: flat input for 2 seconds means a muted mic</span>
<span class="kw">if</span> (msSinceLevelAbove(<span class="num">0.02</span>) &gt; <span class="num">2000</span>) ui.banner(<span class="str">'No sound for 2 seconds. Your mic looks muted.'</span>, <span class="str">'Unmute'</span>);</code></pre>
