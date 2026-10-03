const $=id=>document.getElementById(id);
const form=$("riskForm"), submitBtn=$("submitBtn"), resultCard=$("resultCard");
const meterProgress=$("meterProgress"), circumference=2*Math.PI*100;
meterProgress.style.strokeDasharray=circumference; meterProgress.style.strokeDashoffset=circumference;

const fields=["person_age","person_income","person_home_ownership","person_emp_length","loan_intent","loan_grade","loan_amnt","loan_int_rate","loan_percent_income","cb_person_cred_hist_length"];
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const getDefault=()=>document.querySelector('input[name="default_radio"]:checked')?.value||"N";

function updateProgress(){
  const filled=fields.filter(id=>{const e=$(id);return e&&String(e.value).trim()!==""}).length;
  const pct=Math.round(filled/fields.length*100);
  $("progressBar").style.width=pct+"%"; $("progressText").textContent=pct+"%";
}
function updateRatio(){
  const income=Number($("person_income").value)||0, loan=Number($("loan_amnt").value)||0;
  const ratio=income>0?loan/income:0;
  $("loan_percent_income").value=ratio.toFixed(2);
  $("ratioFill").style.width=clamp(ratio*100,0,100)+"%";
  $("ratioHint").textContent=income>0?`Auto-calculated: ${ratio.toFixed(2)} of annual income (${Math.round(ratio*100)}%).`:"Enter annual income to calculate this ratio.";
}
function updateGrade(){
  const g=$("loan_grade").value, dot=$("gradeDot");
  dot.style.color=g<="B"?"#15966d":g<="D"?"#ff8a3d":"#d94d39";
}
async function checkAPI(){
  const pill=$("apiStatus");
  try{const r=await fetch("/health",{cache:"no-store"}),d=await r.json();
    if(r.ok&&d.model_loaded){pill.className="api-pill ok";pill.innerHTML="<i></i><b>API READY</b>"}else throw 0;
  }catch(e){pill.className="api-pill bad";pill.innerHTML="<i></i><b>API OFFLINE</b>"}
}
function setLoading(on){submitBtn.disabled=on;submitBtn.classList.toggle("loading",on);submitBtn.querySelector("span").textContent=on?"Assessing profile…":"Run risk assessment";}
function resetResult(){
  $("resultTitle").textContent="Awaiting assessment"; $("resultBadge").textContent="READY"; $("resultBadge").className="badge";
  $("probability").textContent="—"; $("threshold").textContent="—"; $("decisionText").textContent="Complete the profile";
  $("decisionSub").textContent="Your model result will appear after you run the assessment.";
  $("decisionDot").className=""; $("probabilityStat").textContent="—"; $("thresholdStat").textContent="—"; $("decisionStat").textContent="—";
  $("signalText").textContent="The trained model will evaluate the completed borrower profile.";
  meterProgress.style.strokeDashoffset=circumference; meterProgress.style.stroke="#ff6b1a";
}
function showResult(data){
  const probability=clamp(Number(data.default_probability)||0,0,1), pct=probability*100;
  const threshold=Number(data.threshold)||0, high=Number(data.default_prediction)===1, color=high?"#d94d39":"#15966d";
  $("resultTitle").textContent=high?"Higher risk signal":"Lower risk signal";
  $("resultBadge").textContent=high?"HIGH RISK":"LOW RISK"; $("resultBadge").className="badge "+(high?"high":"low");
  $("probability").textContent=pct.toFixed(1); $("threshold").textContent=(threshold*100).toFixed(1)+"%";
  $("decisionText").textContent=data.Result||(high?"High Risk":"Low Risk");
  $("decisionSub").textContent=high?"The estimated default probability is above the model threshold.":"The estimated default probability is below the model threshold.";
  $("decisionDot").className=high?"high":"low"; $("probabilityStat").textContent=pct.toFixed(1)+"%";
  $("thresholdStat").textContent=(threshold*100).toFixed(1)+"%"; $("decisionStat").textContent=high?"HIGH":"LOW";
  $("signalText").textContent=high?"The model probability crosses its decision threshold for this profile.":"The model probability remains below its decision threshold for this profile.";
  meterProgress.style.stroke=color;
  requestAnimationFrame(()=>meterProgress.style.strokeDashoffset=circumference-circumference*probability);
  resultCard.animate([{transform:"scale(.985)",opacity:.7},{transform:"scale(1)",opacity:1}],{duration:500,easing:"cubic-bezier(.2,.8,.2,1)"});
  document.querySelector(".result-panel").scrollIntoView({behavior:"smooth",block:"nearest"});
}
fields.forEach(id=>{const e=$(id);if(!e)return;e.addEventListener("input",()=>{updateProgress();if(id==="person_income"||id==="loan_amnt")updateRatio()});e.addEventListener("change",()=>{updateProgress();if(id==="loan_grade")updateGrade()})});
document.querySelectorAll('input[name="default_radio"]').forEach(r=>r.addEventListener("change",updateProgress));

form.addEventListener("submit",async e=>{
  e.preventDefault();$("errorNote").hidden=true;setLoading(true);
  const payload={
    person_age:Number($("person_age").value),person_income:Number($("person_income").value),
    person_home_ownership:$("person_home_ownership").value,person_emp_length:Number($("person_emp_length").value),
    loan_intent:$("loan_intent").value,loan_grade:$("loan_grade").value,loan_amnt:Number($("loan_amnt").value),
    loan_int_rate:Number($("loan_int_rate").value),loan_percent_income:Number($("loan_percent_income").value),
    cb_person_default_on_file:getDefault(),cb_person_cred_hist_length:Number($("cb_person_cred_hist_length").value)
  };
  try{const response=await fetch("/predict",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
    const data=await response.json();if(!response.ok)throw new Error(data.detail?.[0]?.msg||"Prediction request failed.");showResult(data);
  }catch(err){$("errorNote").textContent="Could not complete the assessment: "+err.message;$("errorNote").hidden=false}
  finally{setLoading(false)}
});
$("resetBtn").addEventListener("click",()=>{
  form.reset();$("person_age").value=30;$("person_income").value=600000;$("person_emp_length").value=5;$("loan_amnt").value=100000;
  $("loan_int_rate").value=11.5;$("cb_person_cred_hist_length").value=6;$("loan_percent_income").value=.17;
  $("errorNote").hidden=true;updateRatio();updateGrade();updateProgress();resetResult();
});
$("againBtn").addEventListener("click",()=>document.getElementById("assessment").scrollIntoView({behavior:"smooth"}));
updateRatio();updateGrade();updateProgress();resetResult();checkAPI();
