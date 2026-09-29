---
id: file-upload
title: File Upload UX
category: forms
order: 3
---
## Rule
<p>Upload is a whole system of states, not a bare <code class="tok">&lt;input type="file"&gt;</code>: drag-over feedback, honest per-file progress, error recovery, a preview once it lands, and a queue when multiple files go at once. Support drag-and-drop and a plain click-to-browse button together, never just one; not everyone drags, and not everyone notices a drop zone is a drop zone. Show percent complete plus a time-remaining estimate rather than an indeterminate spinner, since spinners give no sense of whether a large file is almost done or barely started. Once a file lands, let someone remove it before they submit, the same way they'd delete a wrong attachment from an email. On failure, retry inline with the same file still loaded in memory; forcing a full re-select after a failed 200MB upload is a real cost to whoever hit it.</p>
## Do
- Drag-and-drop and click-to-browse both supported, not just one
- Percent + time-remaining, not a bare spinner
- Remove a file before submit, the same as deleting a wrong email attachment
## Avoid
- Forcing a full re-select after a failure
## Code: JS
<pre><code>dropzone.addEventListener(<span class="str">'dragover'</span>, e => { e.preventDefault(); dropzone.classList.add(<span class="str">'drag'</span>); });
dropzone.addEventListener(<span class="str">'drop'</span>, e => {
  e.preventDefault(); dropzone.classList.remove(<span class="str">'drag'</span>);
  [...e.dataTransfer.files].forEach(uploadWithProgress);
});

<span class="kw">function</span> <span class="fn">uploadWithProgress</span>(file) {
  <span class="kw">const</span> xhr = <span class="kw">new</span> XMLHttpRequest();
  <span class="kw">const</span> startedAt = performance.now();
  xhr.upload.onprogress = (e) => {
    <span class="kw">const</span> pct = Math.round((e.loaded / e.total) * <span class="num">100</span>);
    <span class="kw">const</span> rate = e.loaded / ((performance.now() - startedAt) / <span class="num">1000</span>);
    <span class="kw">const</span> etaSec = Math.round((e.total - e.loaded) / rate);
    updateRow(file, { pct, etaSec });
  };
  xhr.onerror = () => updateRow(file, { error: <span class="kw">true</span>, retry: () => uploadWithProgress(file) }); <span class="cm">// file stays loaded</span>
  xhr.open(<span class="str">'POST'</span>, <span class="str">'/upload'</span>); xhr.send(toFormData(file));
}</code></pre>
