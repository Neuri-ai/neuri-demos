import axios from 'axios';
import '../../interfaces/index';

class PushToTalk extends HTMLElement {
	public shadowDOM: any;
	public $component: any;
	public $recognition: any;
	public $eventDetails: Object = {}
	public $onStart: any = new CustomEvent('onStart', { bubbles: true, composed: true, cancelable: true, detail: { message: 'Starting' } });
	public $onInitilized: any = new CustomEvent('onInitilized', { bubbles: true, composed: true, cancelable: true, detail: { message: 'initialized' } });
	public $onspeech: any = new CustomEvent('onSpeech', { bubbles: true, composed: true, cancelable: true, detail: this.$eventDetails });
	public $onResult: any = new CustomEvent('onResult', { bubbles: true, composed: true, cancelable: true, detail: this.$eventDetails });
	public $onError: any = new CustomEvent('onError', { bubbles: true, composed: true, cancelable: true, detail: this.$eventDetails });


	constructor() {
		super();
		this.shadowDOM = this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		this.mapComponentAttributes();
		this.render();
		this.initComponent();
	}

	mapComponentAttributes() {
		const attributesMapping = [
			'apiKey',
			'lang',
			'realtime',
			'service',
			// styling attributes
			'placement',
			'size',
			'backgroundColor',
			'iconColor',
			'typography',
			'cssUrl',
			// active button
			'iconSize',
			'iconColor',
			'iconHoverColor',
			'activeBgColor',
		];
		attributesMapping.forEach(key => {

			// apikey is required
			if (key === 'apiKey' || key === 'lang') {
				if (!this.hasAttribute(key)) {
					throw new Error(`${key} is required`);
				}
			}

			// set realtime and hide to false if not set
			if (key === 'realtime' || key === 'hide') {
				if (!this.hasAttribute(key)) {
					this.setAttribute(key, "false");
				}
			}

			// ser default service as default (intent and entity recognition)
			if (key === 'service') {
				if (!this.hasAttribute(key)) {
					this.setAttribute(key, "default");
				}
			}

			if (!this.attributes) {
				this.attributes[key] = { value: '' };
			}
		});
	}

	render() {
		this.shadowDOM.innerHTML = `
			${this.templateCss()}
			${this.template()}
		`;
	}

	initComponent() {
		this.$component = this.shadowDOM.querySelector('.push-to-talk-box');
		let microphone = this.shadowDOM.querySelector('.rounded-microphone-icon-button');
		let helpMessage = this.shadowDOM.querySelector('.push-help-text');

		// when recoginition is started show help message for 1 second
		this.addEventListener('onStart', () => {
			helpMessage.style.display = 'block';
			setTimeout(() => {
				helpMessage.style.display = 'none';
			} , 2000);
		} );

		this.loadSpeechRecognition();

		microphone.onclick = () => {
			this.$recognition.start();
		}

		// when component is loaded show help message and hide after 2 seconds

	}

	loadSpeechRecognition() {
		let transcript: String = '';
		let finalTranscript: String = '';

		const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
		this.$recognition = new SpeechRecognition();

		// set speech recognition properties
		this.$recognition.interimResults = this.attributes['realtime'].value === '' ? false : true;
		this.$recognition.lang = this.attributes['lang'].value;

		// dispatch oninitilize event
		this.dispatchEvent(this.$onStart);

		// Add in future audio Db filtering
		this.$recognition.onstart = () => {
			this.dispatchEvent(this.$onInitilized);
		};

		// when speech is ended stop listening and send message to server
		this.$recognition.onspeechend = () => {
			this.$recognition.stop();
			this.dispatchEvent(this.$onResult);
		}

		this.$recognition.onresult = (event: any) => {
			// check if realtime is set to true to display interim results
			let realtime = (this.attributes['realtime'].value === 'true');
			if (realtime) {
				this.dispatchEvent(this.$onspeech);
			}

		}

	}

	disconnectedCallback() {
		this.remove();
	}

	defaultStyles() {
		return `
		.push-to-talk-box {
			position: absolute;
			bottom: 0;
			text-align: center;
			width: 100%;
		}
		.push-help-text{
			display: none;
		}
		button.rounded-microphone-icon-button{
			width: ${this.attributes['size'] ? this.attributes['size'].value : '68px'};
			height: ${this.attributes['size'] ? this.attributes['size'].value : '68px'};
			border-radius: 50%;
			background: ${this.attributes['backgroundColor'] ? this.attributes['backgroundColor'].value : 'linear-gradient(180deg, #518EF8 0%, #1163FF 100%)'};
			border: none;
			cursor: pointer;
		}
		button.rounded-microphone-icon-button:hover{
			background: ${this.attributes['activeBgColor'] ? this.attributes['activeBgColor'].value : '#1163FF'};
		}
		`
	}

	templateCss() {
		return this.attributes['cssUrl'] ? `<link rel="stylesheet" href="${this.attributes['cssUrl'].value}">` : `<style>${this.defaultStyles()}</style>`;
	}



	template() {
		return `
		<div class="push-to-talk-box">
			<div class="push-to-talk-box-wave"></div>
			<div class="push-help-text">
				<p>Press the spacebar or click the button to start speaking.</p>
			</div>
			<div class="micrpohone-container">
				<button class="btn btn-primary rounded-microphone-icon-button" >
					<i class="microphone-icon"></i>
				</button>
			</div>
		</div>
	`;

	}
}

export default PushToTalk;