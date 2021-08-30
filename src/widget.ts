// Copyright (c) Matt McFarland
// Distributed under the terms of the Modified BSD License.

import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
} from '@jupyter-widgets/base';

import { MODULE_NAME, MODULE_VERSION } from './version';

// Import the CSS
import '../css/widget.css';

export class PCEModel extends DOMWidgetModel {
  defaults(): any {
    return {
      ...super.defaults(),
      _model_name: PCEModel.model_name,
      _model_module: PCEModel.model_module,
      _model_module_version: PCEModel.model_module_version,
      _view_name: PCEModel.view_name,
      _view_module: PCEModel.view_module,
      _view_module_version: PCEModel.view_module_version,
      value: 'Hello World',
    };
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    // Add any extra serializers here
  };

  static model_name = 'PCEModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'PCEView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class PCEView extends DOMWidgetView {
  private _pceFrame: HTMLIFrameElement;

  render(): void {
    this._pceFrame = document.createElement('iframe');
    this._pceFrame.src =
      'http://localhost:3000/explore?embed=true&collection=' +
      this.model.get('collection') +
      '&bbox=' +
      this.model.get('bbox');

    this._pceFrame.width = '100%';
    this._pceFrame.height = '500px';
    this._pceFrame.classList.add('pc-frame');

    this.el.appendChild(this._pceFrame);

    this.model.on('change:collection', this.onCollectionChange, this);
    this.model.on('change:bbox', this.onBboxChange, this);
  }

  private onCollectionChange = () => {
    this._pceFrame.contentWindow?.postMessage(
      { collection: this.model.get('collection') },
      '*'
    );
  };

  private onBboxChange = () => {
    this._pceFrame.contentWindow?.postMessage(
      { bbox: this.model.get('bbox') },
      '*'
    );
  };
}
