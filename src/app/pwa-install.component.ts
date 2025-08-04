import { Component, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
    selector: 'pwa-install',
    template: `
    <div *ngIf="show">
      <div class="modal">
        <h3>Install this app</h3>
        <button (click)="installPwa()" class="install">Install</button>
        <button (click)="hideDialog()" class="cancel">Close</button>
      </div>
    </div>
    <button *ngIf="!show && isInstallAvailable && !isStandalone" (click)="showDialog()" class="promp">
      Click to install
    </button>
  `,
    styles: [`
    div { position: fixed; top: 20%; left: 40%; background: white; border: 1px solid #ccc; padding: 2em; }
    .promp{background:transparent;border:none;color:white;width:100%}
    .modal button{ color:black;}
    .install{background:green}
    .cancel{background:red}
  `]
})
export class PwaInstallComponent implements OnInit {

    deferredPrompt: any = null;
    isInstallAvailable = false;
    isStandalone = false;
    show = false;

    ngOnInit() {
        this.isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true;

        window.addEventListener('beforeinstallprompt', (e: any) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.isInstallAvailable = true;
        });

        window.addEventListener('appinstalled', () => {
            this.hideDialog();
        });
    }

    showDialog() {
        this.show = true;
    }

    hideDialog() {
        this.show = false;
    }

    installPwa() {
        if (!this.deferredPrompt) {
            return;
        }
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then((result: any) => {
            if (result.outcome === 'accepted') {
            } else {
            }
            this.deferredPrompt = null;
            this.hideDialog();
        });
    }
}
