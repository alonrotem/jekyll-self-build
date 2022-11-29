#Prerequisites
function CheckPrerequisite($prname, $prcmd, $getUrl)
{
    Write-Host "Checking for $prname installation..." -ForegroundColor Yellow
    try
    {
        Invoke-Expression -Command $prcmd | Out-Null
        Write-Host "$prname is installed" -ForegroundColor Green
        return $true
    }
    catch [System.Management.Automation.CommandNotFoundException]
    {
        Write-Host "$prname is not installed" -ForegroundColor Red
        Write-Host "Returned error: $_" -ForegroundColor DarkGray
        if(![string]::IsNullOrWhiteSpace($getUrl))
        {
            Start-Process $getUrl
        }
        
    }
    return $false
}

$checked = CheckPrerequisite "Git" "git" "https://git-scm.com/downloads"
if($checked)
{
    $checked = CheckPrerequisite "Ruby" "ruby --version" "https://rubyinstaller.org/downloads/"
}
if($checked)
{
    $checked = CheckPrerequisite "RubyGems" "gem -v" "https://rubygems.org/pages/download"
}
if($checked)
{
    $checked = CheckPrerequisite "Bundler" "bundle --version"
}
if($checked)
{
    $checked = CheckPrerequisite "Jekyll" "jekyll -v"
}
if(!$checked)
{
    Write-Host "Please fix prerequisites first. Then run the script again." -ForegroundColor Red
    exit 0
}

<#
Set local login?
(may not affect the live repo)

Options
* Push latest changes for publishing
* Build locally and push to live branch
* Remove duplicates

Publish:
1. get latest

2. check the latest changes' filenames
git diff --name-only --diff-filter=acdrtux HEAD~1 HEAD

3. for each file, check the previous content 
git show HEAD~1:<filename>

compare to the current filename


option 1: fix unhidden article and push to work branch

option 2: fix unhidden article, do a full local build and push to master branch
#>
