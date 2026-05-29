import { LightningElement, track } from 'lwc';
import getAuthToken from '@salesforce/apex/AuthTokenController.getAuthToken';

export default class TokenGeneratorCanvas extends LightningElement {
    @track username = '';
    @track token = '';
    @track errorMessage = '';
    @track isLoading = false;
    @track copyButtonLabel = '📋 Copy Token';

    handleInputChange(event) {
        this.username = event.target.value;
        this.token = ''; 
        this.errorMessage = ''; 
    }

    get isSubmitDisabled() {
        return !this.username || this.isLoading;
    }

    async handleGenerateToken() {
        this.isLoading = true;
        this.token = '';
        this.errorMessage = '';
        
        try {
            const result = await getAuthToken({ targetUsername: this.username });
            
            if (result.status === 'Success') {
                this.token = result.token;
            } else {
                this.errorMessage = result.message; 
            }
        } catch (error) {
            this.errorMessage = error.body?.message || error.message || 'An unexpected platform connection error occurred.';
        } finally {
            this.isLoading = false;
        }
    }

    handleCopyToClipboard() {
        const textElement = this.template.querySelector('.raw-token-stream');
        textElement.select();
        document.execCommand('copy');
        
        this.copyButtonLabel = '✓ Copied to Clipboard!';
        setTimeout(() => {
            this.copyButtonLabel = '📋 Copy Token';
        }, 2000);
    }
}
