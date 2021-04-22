let LOCATION_DATA = {};
let TIMER_ID = 0;

/******************************************************************************
 * 1. Classes
 *****************************************************************************/
class Location {
   constructor(distance = 1, azimuth = 0) {
      this._distance = distance;
      this._azimuth = azimuth;
      this.default = true;
   }

   get distance() {
      return this._distance;
   }

   set distance(value) {
      this.default = false;
      this._distance = value;
   }

   get azimuth() {
      return this._azimuth;
   }

   set azimuth(value) {
      this.default = false;
      this._azimuth = value;
   }

   equals(rhs) {
      return (this.distance === rhs.distance
         && this.azimuth === rhs.azimuth);
   }
}

class Side {
   constructor(l = 0) {
      this.length = l;
   }
}

class Angle {
   constructor(a = 0) {
      this._radians = a;
      this.degrees = Angle.toDegrees(a);
   }

   get radians() {
      return this._radians;
   }

   set radians(r) {
      this._radians = r;
      this.degrees = Angle.toDegrees(this._radians);
   }

   validate() {
      let degrees = this.degrees % 360;
      this.radians = Angle.toRadians(degrees);
   }

   static toRadians(degrees) {
      return degrees * Math.PI / 180;
   }
   static toDegrees(radians) {
      return radians * 180 / Math.PI;
   }

}

/******************************************************************************
 * 2. Initialization
 *****************************************************************************/
function init() {
   const ids = ['target', 'friend'];

   for (let id of ids) {
      const btn_list = document.querySelectorAll(`#${id} .btn`);
      initButtonList(btn_list);

      const inputs = document.querySelectorAll(`#${id} .input`);
      initInputList(inputs);

      const btn_rename = document.querySelectorAll(`#${id} input[type="text"]`);
      initRenameButtons(btn_rename);
   }

   const confirms = document.querySelectorAll('.btn.confirm');
   initConfirmationButtons(confirms);

   const themes = document.querySelectorAll('.theme');
   initColorSchemes(themes);

   const timer = document.getElementById('timer');
   timer.addEventListener('click', toggleTimer);

   const hamburger = document.querySelector('.hamburger');
   hamburger.addEventListener("click", function () {
      this.classList.toggle("is-active");
   }, false);
}

function initButtonList(btn_list) {
   btn_list.forEach(element => {
      element.addEventListener('click', selectLocation);
      element.addEventListener('dblclick', renameButton);
      LOCATION_DATA[element.name] = new Location();
   });
   loadLocation(btn_list[0]);
}

function initInputList(inputs) {
   inputs.forEach(element => {
      element.addEventListener('input', onTextBoxUpdate);
   });
}

function initConfirmationButtons(btn_list) {
   btn_list.forEach(element => {
      element.addEventListener('click', confirmClick);
      element.addEventListener('blur', () => element.classList.remove('selected'));
   });
}

function initRenameButtons(btn_list) {
   btn_list.forEach(element => {
      element.addEventListener('blur', applyRename)
   });
}

function initColorSchemes(btn_list) {
   btn_list.forEach(element => {
      element.addEventListener('click', updateTheme);
   });
}

/******************************************************************************
 * 3. Event Handlers
 *****************************************************************************/
function onTextBoxUpdate(event) {
   saveLocation(event);
   updateResults();
}

function selectLocation(click) {
   let parent = this.parentElement;
   if (parent) {
      let children = parent.querySelectorAll('.btn');
      children.forEach(element => {
         element.classList.remove('selected');
      });

      this.classList.add('selected');
   }
   loadLocation(this);
   updateResults();
}

function renameButton() {
   this.classList.add('hide');
   const input = document.querySelector(`input[name="i${this.name}"]`);
   input.value = this.value;
   input.classList.remove('hide');
   input.select();
}

function applyRename() {
   this.classList.add('hide');
   const button = document.querySelector(`input[name="${this.name.slice(1)}"]`);
   button.value = this.value;
   button.classList.remove('hide');
}

function toggleTimer() {
   const clock = document.getElementById('timer')
   if (!TIMER_ID) {
      TIMER_ID = setInterval(tick, 1000, clock);
      clock.classList.add('selected');
   }
   else {
      clearInterval(TIMER_ID);
      TIMER_ID = 0;
      clock.classList.remove('selected');
      clock.value = '10:00';
   }
}

function tick(clock) {
   let [min, sec] = clock.value.split(':');
   let time = ((Number(min) * 60) + Number(sec));

   if (time > 0) {
      time -= 1;
      min = String(~~(time / 60)).padStart(2, '0');
      sec = String(~~time % 60).padStart(2, '0');
      clock.value = `${min}:${sec}`;
   }
   else {
      clock.classList.toggle('selected');
   }
}

function updateTheme() {
   const remove = getThemes();
   const theme = this.value;

   const body = document.querySelector('body');
   body.classList.remove(...remove)
   body.classList.add(theme);
}

/* Call backs stored in HTML */
function reset() {
   for (let item in LOCATION_DATA) {
      const button = document.querySelector(`input[name="${item}"]`);
      button.value = `Location ${item[item.length - 1]}`;
      LOCATION_DATA[item] = new Location();
   }

   for (let id of ['distance', 'azimuth']) {
      const input = document.querySelector(`#${id}__old`);
      input.value = '';
   }

   const selected = getSelectedButtons();
   selected.forEach((button) => button.click());
}

function relocate() {
   const newLocation = ['distance', 'azimuth'].reduce(
      (location, element) => {
         const input = document.querySelector(`#${element}__old`);
         input.value = '';
         location[element] = input.value;
         return location;
      }, new Location());

   if (newLocation.distance === '' || newLocation.azimuth === '') return;

   newLocation.distance = Number(newLocation.distance);
   newLocation.azimuth = ((Number(newLocation.azimuth) + 180) % 360); // point the other way

   for (const key in LOCATION_DATA) {
      if (!LOCATION_DATA[key].default) {
         LOCATION_DATA[key] = calcVector(newLocation, LOCATION_DATA[key]);
         const button = document.querySelector(`input[name="${key}"]`);
         if (Array.from(button.classList).includes('selected')) {
            button.click();
         }
      }
   }

}

/******************************************************************************
 * 4. Confirmation Buttons
 *****************************************************************************/
function confirmClick() {
   if (Array.from(this.classList).includes('selected')) {
      this.classList.remove('selected');
      const callback = window[this.dataset.callback];
      if (typeof callback === 'function') callback.apply(this);
   }
   else {
      this.classList.add('selected');
   }
}

/******************************************************************************
 * X. ???
 *****************************************************************************/
function getThemes() {
   const themes = document.querySelectorAll('.theme');
   return Array.from(themes).map(theme => theme.value);
}

function getSelectedButtons() {
   const thing = ['friend', 'target'].map((id) => {
      return document.querySelector(`#${id} .btn.selected`);
   });
   return thing;
}

function getSelectedLocations() {
   const buttons = getSelectedButtons();
   return buttons.map((button) => LOCATION_DATA[button.name]);
}

function updateResults() {
   let [friend, target] = getSelectedLocations();

   const result = calcVector(friend, target);

   document.querySelector('#distance__result').innerText = result.distance.toFixed(1);
   document.querySelector('#azimuth__result').innerText = result.azimuth.toFixed(1);
}

function loadLocation(selected) {
   const data = LOCATION_DATA[selected.name];

   let set = selected.name.includes('tl')
      ? 'target'
      : 'friend';

   document.querySelector(`#distance__${set}`).value = Math.round(data.distance);
   document.querySelector(`#azimuth__${set}`).value = Math.round(data.azimuth);
}

function saveLocation(changed) {
   let [attribute, team] = changed.target.id.split('__');
   let value = changed.target.value;

   let selected = document.querySelector(`#${team} .btn.selected`);
   if (selected) {
      LOCATION_DATA[selected.name][attribute] = Number(value);
   }
}

function calcVector(friend, target) {
   if (friend.equals(target)) {
      return new Location(0, 0);
   }

   function lawOfCosinesTwoSides(a, b, theta) {
      let c = new Side();
      let a_2 = a.length ** 2;
      let b_2 = b.length ** 2;
      let cosine = 2 * a.length * b.length * Math.cos(theta.radians);

      let c_2 = a_2 + b_2 - cosine;
      c.length = Math.sqrt(c_2);
      return c;
   };

   function lawOfCosinesThreeSides(a, b, c) {
      let a_2 = a.length ** 2;
      let b_2 = b.length ** 2;
      let c_2 = c.length ** 2;
      let divisor = 2 * a.length * b.length;

      let cosC = (a_2 + b_2 - c_2) / divisor;
      return new Angle(Math.acos(cosC));
   };

   const SF = new Side(friend.distance); // Spotter to Friend
   const ST = new Side(target.distance); // Spotter to Target
   let FT;                               // Friend  to Target (result)

   const NSF = new Angle(Angle.toRadians(friend.azimuth)); // North to Spotter to Friend
   const NST = new Angle(Angle.toRadians(target.azimuth)); // North to Spotter to Target
   let NFT;                                               // North to Friend  to Target (result)

   // Calculated values
   let SFT;                       // Spotter to Friend to Target
   let delta;                     // Change between NSF and NST
   const PI = new Angle(Math.PI); // 180 degree angle for easy computing

   delta = new Angle(Math.abs(NSF.radians - NST.radians));

   FT = lawOfCosinesTwoSides(SF, ST, delta);

   // Order matters here. Side ST must always be the 3rd parameter.
   SFT = lawOfCosinesThreeSides(SF, FT, ST);

   // Make sure Angle stays between 0 - 360 degrees or 0 and 2PI radians
   delta.validate();
   //NFT = NSF + PI + ((delta.degrees > PI.degrees ^ NST > NSF) ? -SFT : SFT)

   NFT = new Angle(
      NSF.radians
      + PI.radians
      + ((delta.degrees > PI.degrees ^ NST.radians > NSF.radians)
         ? (-SFT.radians)
         : SFT.radians)
   );
   NFT.validate();

   return new Location(FT.length, Angle.toDegrees(NFT.radians));

}

init();