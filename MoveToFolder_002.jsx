/**
* @@@BUILDINFO@@@ MoveToFolder.jsx Version 1 Sun Feb 16 2020 00:54:21 GMT-0800
* by Christopher Kirkman
* This script will move selected items in the project panel to a top level folder specified by the user
* If the folder name doesn't exist, the user can choose to create it.

To Dos - 
Select all items by file type (png, jpg, mov, etc..)
Add drop down list to select from existing folders (instead of asking user to type)
Other things? I dunno.
Use, modify, distribute, just don't charge.
*/


var sel = app.project.selection;
var proj = app.project;
var itms = proj.items;
var itmsLen = itms.length;
var curItem;
var FI;
var f;
var fname;
var fAlert = new Window('dialog', 'Move to Folder Alert');
var fPrompt = new Window('dialog', 'Move to Folder');

app.beginUndoGroup("Move to Folder");
    startMove();
app.endUndoGroup();


function moveToFolder(curItemAry, parentFolderObj){
                var aLen = curItemAry.length;
                for(var i=0; i<aLen; i++){
                                curItemAry[i].parentFolder = parentFolderObj;
                }
}

function startMove(){
    if(sel.length<1){
        alert("No items selected");
        return;
        }
    var folderName = "";
    fPrompt.folderPrompt = fPrompt.add('panel', undefined,'Folder to move to:');
    fPrompt.folderPrompt.fname = fPrompt.folderPrompt.add('edittext', undefined, '', {multiline:false});
    fPrompt.folderPrompt.fname.size = [150,20];
    fPrompt.folderPrompt.buildBtn = fPrompt.folderPrompt.add('button', undefined, 'Ok',{name:'ok'});
    fPrompt.folderPrompt.cancelBtn = fPrompt.folderPrompt.add('button', undefined, 'Cancel',{name:'cancel'});
    fPrompt.folderPrompt.buildBtn.onClick = function(){ folderName = fPrompt.folderPrompt.fname.text; this.parent.parent.close(1);}
    fPrompt.show();
                        
    if(folderName.length<1){
            //alert("No folder name specified");
            var noFolder= new Window('dialog', 'Move to Folder');
            noFolder.msg = noFolder.add('statictext', undefined, 'No folder specified');
            noFolder.okBtn = noFolder.add('button', undefined, "Oops, I'll try again");
            noFolder.okBtn.onClick= function(){this.parent.close(1);}
            noFolder.show();
        return;
        }
   
        for(var i=1; i<itmsLen; i++){
            curItem = itms[i];
           
            if(curItem instanceof FolderItem){
                    if(curItem.name == folderName){
                                FI = i;
                                f = app.project.item(FI);
                                moveToFolder(sel,f);
                                break;
                    }else{
                        fAlert.btnPnl = fAlert.add('panel', undefined, 'No folder with the name: "'+folderName+'". Create it?');
                        fAlert.btnPnl.buildBtn = fAlert.btnPnl.add('button', undefined, 'Yes, create it',{name:'ok'});
                        fAlert.btnPnl.cancelBtn = fAlert.btnPnl.add('button', undefined, 'Nope, nevermind.',{name:'cancel'});
                        fAlert.btnPnl.buildBtn.onClick = function(){
                            var folderTarget = app.project.items.addFolder(folderName);
                            moveToFolder(sel,folderTarget);
                            this.parent.parent.close(1);
                        }
                         fAlert.show();
                        break;
                  }
            }
       }
}