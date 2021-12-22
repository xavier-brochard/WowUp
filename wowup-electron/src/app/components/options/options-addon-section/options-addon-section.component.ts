import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { filter } from "lodash";
import { WowUpService } from "../../../services/wowup/wowup.service";
import { AddonService } from "../../../services/addons/addon.service";
import { AddonProviderState } from "../../../models/wowup/addon-provider-state";
import { MatSelectionListChange } from "@angular/material/list";
import { AddonProviderFactory } from "../../../services/addons/addon.provider.factory";

@Component({
  selector: "app-options-addon-section",
  templateUrl: "./options-addon-section.component.html",
  styleUrls: ["./options-addon-section.component.scss"],
})
export class OptionsAddonSectionComponent implements OnInit {
  public enabledAddonProviders = new FormControl();
  public addonProviderStates: AddonProviderState[] = [];

  public constructor(
    private _addonService: AddonService,
    private _addonProviderService: AddonProviderFactory,
    private _wowupService: WowUpService
  ) {}

  public ngOnInit(): void {
    this.addonProviderStates = filter(
      this._addonProviderService.getAddonProviderStates(),
      (provider) => provider.canEdit
    );
    this.enabledAddonProviders.setValue(this.getEnabledProviderNames());
  }

  public onProviderStateSelectionChange(event: MatSelectionListChange): void {
    event.options.forEach((option) => {
      this._wowupService.setAddonProviderState({
        providerName: option.value,
        enabled: option.selected,
        canEdit: true,
      });

      const providerName: string = option.value;
      this._addonService.setProviderEnabled(providerName, option.selected);
    });
  }

  private getEnabledProviders() {
    return this.addonProviderStates.filter((state) => state.enabled);
  }

  private getEnabledProviderNames() {
    return this.getEnabledProviders().map((provider) => provider.providerName);
  }
}
