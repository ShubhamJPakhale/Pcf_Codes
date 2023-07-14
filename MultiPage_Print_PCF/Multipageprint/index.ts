import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class Multipageprint
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private theContext: ComponentFramework.Context<IInputs>;
  private theNotifyOutputChanged: () => void;
  private theContainer: HTMLDivElement; // container for print pcf
  private customParent: HTMLDivElement;
  private varControlName: String; // variable for control name from powerapps to pcf
  private PrintButtonName: String; // variable for print button name from powerapps to pcf for print event trigger
  private frame1: HTMLIFrameElement; // iframe for printing scrollable screen data inside pcf component for multi page print

  outputbase: string;
  private eventPrintEntirePage: EventListenerOrEventListenerObject; // Event for triggering pcf code component for multi page print

  private button: HTMLButtonElement;

  constructor() {}

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this.theContext = context;
    this.theNotifyOutputChanged = notifyOutputChanged;
    this.theContainer = container;

    // Event Listener for Print Multi Scrollable page
    this.eventPrintEntirePage = this.eventPrintPage.bind(this);

    // Variable for taking value from powerapps to pcf
    this.varControlName = String(this.theContext.parameters.ControlName.raw);
    // this.PrintButtonName = String(
    //   this.theContext.parameters.PrintButtonName.raw
    // );

    this.button = document.createElement("button");
    this.button.innerHTML = "Print";
    this.button.addEventListener("click", this.eventPrintEntirePage);
    this.button.style.width = "120px";
    this.button.style.height = "50px";
    this.button.style.fontSize = "25px";
    this.button.style.backgroundColor = "rgba(97,33,102,1)";
    this.button.style.color = "white";

    container.appendChild(this.button);

    //Button for triggering pcf multi page code
    // var button1 = document.querySelector(
    //   "[data-control-name=" + this.PrintButtonName + "]"
    // );
    // var demo = button1
    //   ?.querySelector(".appmagic-borderfill-container")
    //   ?.addEventListener("click", this.eventPrintPage);
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */
  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this.theContext = context;

    this.varControlName = String(this.theContext.parameters.ControlName.raw);
    // this.PrintButtonName = String(
    //   this.theContext.parameters.PrintButtonName.raw
    // );
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs(): IOutputs {
    return {};
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }

  private eventPrintPage(event: Event): void {
    this.PrintPage(this.varControlName);
  }

  private PrintPage(varControlName: any) {
    var parentContents = document.querySelector(
      "[data-control-name=" + this.varControlName + "]"
    );
    var divContents =
      parentContents?.querySelector(".appmagic-borderfill-container")
        ?.innerHTML || "Demo Print page";

    this.frame1 = document.createElement("iframe");
    this.frame1.name = "frame1";
    this.frame1.style.position = "absolute";
    this.frame1.style.top = "0px";
    this.frame1.style.display = "none";
    document.body.appendChild(this.frame1);

    this.frame1.contentWindow?.document.open();
    this.frame1.contentWindow?.document.write(
      `<html>
            <head>
            <style type='text/css' media='print'>
            @page
            {
                size:A4 Portrait;
                
            }
            html
            {
                background-color:rgba(255,255,255,1);
            }
            body
            {
                position:absolute;
                visibility:visible;
               
                font-size:30px;
                
                
                
            }
            </style>
            </head>
            <body>
            <div class='Data'>${divContents}</div>
            </body>
            </html>`
    );

    this.frame1.contentWindow?.document.close();

    this.printiframe();
  }

  private printiframe() {
    if (window.frames[0].document.body.innerHTML != "") {
      window.frames[0].focus();
      window.frames[0].print();
      document.body.removeChild(this.frame1);
    } else {
      setTimeout(this.printiframe, 500);
    }
  }
}
