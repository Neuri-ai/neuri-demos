class Drawer extends HTMLElement{
	public shadowDOM: any;
	public $tag: any;
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
			"message"
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

	getLocalStream() {
		navigator.mediaDevices.getUserMedia({video: false, audio: true}).then((stream) => {
			// hide the popup and refresh the page
			this.$tag.style.display = 'none';
			return
		}).catch(err => {
			this.$tag.style.display = 'inherit';
		})
	}

	initComponent() {
		this.$tag = this.shadowDOM.querySelector('.permission-modal');
		this.getLocalStream();

		let $allowButton = this.shadowDOM.getElementById("permission-allow")
		$allowButton.addEventListener('click', () => {
			this.getLocalStream();
			window.location.reload();
		})

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
						<h2>Microphone blocked</h2>
						<p>${this.attributes.message.value}</p>
					</div>
					<div class="permission-modal-body">
						<button class="permission-modal-button" id="permission-allow">Allow</button>
					</div>
				</div>
			</div>
		`;

	}
}

export default Drawer;