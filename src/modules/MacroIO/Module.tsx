import { R20Module } from "../../tools/R20Module"
import { DOM, SidebarSeparator, SidebarCategoryTitle } from '../../tools/DOM'
import { findByIdAndRemove, readFile } from "../../tools/MiscUtils";
import { R20 } from "../../tools/R20";
import { MacroIO } from "../../tools/MacroIO";
import { saveAs } from 'save-as'

class MacroIOModule extends R20Module.OnAppLoadBase {
    readonly widgetId = "r20es-macro-io-widget";

    constructor() {
        super(__dirname);
    }

    onFileChange(e: any) {
        e.stopPropagation();
        const targ = e.target;
        
        ($(targ.parentNode).find("button.import")[0] as any).disabled = targ.files.length <= 0;
    }

    onImportClick(e: any) {
        e.stopPropagation();
        
        const fs = $((e.target).parentNode.parentNode).find("input[type='file']")[0];

        const file = fs.files[0];
        fs.value = "";
        (e.target as any).disabled = true

        readFile(file)
            .then(payload => MacroIO.importData(R20.getCurrentPlayer(), payload as string))
            .then(result => {
                if(result.isErr()) alert(result.err().unwrap());
                R20.rerenderJournalMacros();
                R20.rerenderMacroBar();
            })
            .catch(alert);
    }

    onExportClick(e: any) {
        e.stopPropagation();

        
        const player = R20.getCurrentPlayer();
        const result = MacroIO.serialize(player);
        console.log(result);
        if(result.isErr()) {
            alert(result.err().unwrap());
            return;
        }
        
        const jsonBlob = new Blob([result.ok().unwrap()], { type: 'data:application/json;charset=utf-8' });
        saveAs(jsonBlob, player.attributes.displayname+ ".json");
    }

    setup() {

        const root = $("#deckstables")[0].firstElementChild;
        const nextTo = $("#deckstables").find("#adddeck")[0]
        const widget = (
            <div id={this.widgetId}>
                <div>
                    <SidebarCategoryTitle>
                        Import/Export Macros
                </SidebarCategoryTitle>

                    <input
                        type="file"
                        style={{ width: "95%" }}
                        onChange={this.onFileChange}
                    />

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <button disabled className="import btn" style={{ marginRight: "8px", width: "100%" }} onClick={this.onImportClick}>
                            Import
                    </button>

                        <button className="btn" style={{ width: "100%" }} onClick={this.onExportClick}>
                            Export
                    </button>
                    </div>

                </div>

                <SidebarSeparator big="1px" />
            </div>
        );

        root.insertBefore(widget, nextTo);
    }

    dispose() {
        findByIdAndRemove(this.widgetId);
        super.dispose();
    }
}

if (R20Module.canInstall()) new MacroIOModule().install();

