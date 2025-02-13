import React from 'react'

const AdminFooter = () => {
    return (
        <footer className="py-3 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">    
         <div className="container">    
            <div className="flex flex-col items-center justify-center space-y-2">    
              
              <p className="text-sm text-muted-foreground">    
                © {new Date().getFullYear()} MindHeal. All rights reserved.    
              </p>    
            </div>    
          </div>    
        </footer>
    
      );
  
}

export default AdminFooter
