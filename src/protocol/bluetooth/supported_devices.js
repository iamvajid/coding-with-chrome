/**
 * @fileoverview List of known and supported Bluetooth devices.
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.provide('cwc.protocol.bluetooth.supportedDevices');


/**
 * List Format:
 *
 * DEVICE CLASS {
 *   DEVICE NAME {
 *     CUSTOM NAME: '...',
 *     DEVICE PROFILE: {...}
 *   }
 * }
 *
 * The profile will be automatically installed as soon the device is detected.
 * The supported device can be accessed over the custom device name.
 *
 * @enum {!Object.<!Object>}
 */
cwc.protocol.bluetooth.supportedDevices = {
  2052: {
    EV3: {
      'name': 'Lego Mindstorms EV3',
      'profile': {
        'uuid': '00001101-0000-1000-8000-00805f9b34fb'
      }
    }
  }
};
