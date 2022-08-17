class CheckPermissions extends HTMLElement{
	public shadowDOM: any;
	public $root: any;
	public $modalDOMMessage: any
	public $modalDOMTitle: any;
	public attributes: any;

	constructor() {
		super();
		this.shadowDOM = this.attachShadow({mode: 'open'});
	}

	connectedCallback() {
		this.mapComponentAttributes();
		this.render();
		this.initComponent();
	}

	mapComponentAttributes() {
		const attributesMapping = [
			"text"
		];
		attributesMapping.forEach(key => {
			if (!this.attributes[key]) {
				this.attributes[key] = {value: 'To use voice input, we needs access to your microphone. Check your browser preferences to allow microphone access and reload the page.'};
			}
		});
	}

	render() {
		this.shadowDOM.innerHTML = `
			${this.templateCss()}
			${this.template()}
		`;
	}

	async checkMicrophone() {
		let permission = navigator.mediaDevices.getUserMedia({video: false, audio: true}).then((stream) => {
			return true;
		}).catch(err => {
			this.$root.style.display = 'inherit';
			return false;
		})
		return permission;
	}

	checkBrowser() {
		const browserspeech = window.webkitSpeechRecognition || window.SpeechRecognition;
		try{
			const browserspeech_ = new browserspeech();
			return true;
		}catch(err){
			this.$root.style.display = 'inherit';
			this.$modalDOMTitle.innerHTML = 'Unsupported browser';
			this.$modalDOMMessage.innerHTML = "To enable the SpeechRecognition in Firefox Nightly > 72, go to about:config and switch the flags media.webspeech.recognition.enable and media.webspeech.recognition.force_enable to true."
			return false;
		}
	}


	async initComponent() {
		let engineAccess: boolean;

		this.$root = this.shadowDOM.querySelector('.permission-modal');
		this.$modalDOMMessage = this.shadowDOM.querySelector('.permission-modal-message');
		this.$modalDOMTitle = this.shadowDOM.querySelector('.permission-modal-title');
		let allowButton = this.shadowDOM.getElementById("permission-allow")

		// check if the browser has the permission to access the microphone
		const micAccess = await this.checkMicrophone();
		if(micAccess){
			engineAccess = this.checkBrowser();
		}

		// if the browser has the permission to access the microphone, check if the browser has the permission to use the speech recognition
		if(micAccess && engineAccess){
			this.$root.style.display = 'none';
		}

		allowButton.onclick = () => {
			setTimeout(() => {
				window.location.reload();
			}, 500);
		}
	}

	disconnectedCallback() {
		this.remove();
	}

	templateCss() {
		return `
		<style>
			.permission-modal{
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				box-shadow: 0 0 1rem 0 rgb(0 0 0 / 20%);
				background-color: rgba(0, 0, 0, .50);
				backdrop-filter: blur(3px);
				z-index: 9999;
				display: none;
			}
			.permission-modal-content{
				max-width: 400px;
				position: absolute;
				top: 44%;
				left: 50%;
				transform: translate(-44%, -50%);
			}
			.permission-modal-header{
				color: #fff;
				font-family: 'Poppins', sans-serif;
			}
			.permission-modal-header>h2{
				font-size: 1.5rem;
				font-weight: 600;
				margin-bottom: 1rem;
			}
			.permission-modal-header>p{
				font-size: 13px;
				margin-bottom: 2rem;
			}
			button.permission-modal-button{
				background-color: transparent;
				border: 1px solid #fff;
				border-radius: 30px;
				font-weight: 600;
				color: #fff;
				font-family: 'Poppins', sans-serif;
				padding: 0.5rem 2.5rem;
				cursor: pointer;
			}
			button.permission-modal-button:hover{
				background-color: #fff;
				color: #000;
				transition: 0.3s ease-in-out;
			}
		</style>
		`;
	}

	template() {
		return `
			<div class="permission-modal">
				<div class="permission-modal-content">
					<div class="permission-modal-header">
						<h2 class="permission-modal-title">Microphone blocked</h2>
						<p class="permission-modal-message">${this.attributes.text.value}</p>
					</div>
					<div class="permission-modal-body">
						<button class="permission-modal-button" id="permission-allow">Allow</button>
					</div>
				</div>
			</div>
		`;

	}
}

export default CheckPermissions;